import { defineStore } from "pinia";
import { IIndexedDocuments, IndexType, IndexedItem } from "./documents";

interface SingleThreadedTasker {
  busy: boolean,
  persist: boolean,
}

interface IIndexedDbStore extends SingleThreadedTasker {
  db?: IDBDatabase,
}

export const useIndexedDbStore = defineStore('indexedDbStore', {
  state(): IIndexedDbStore {
    return {
      busy: false,
      db: undefined,
      persist: false,
    };
  },
  actions: {
    fetch<K extends keyof IIndexedDocuments, R = IIndexedDocuments[K]>(table: K): Promise<R[]> {
      return new Promise(async (res, rej) => {
        if (!this.db) {
          return rej(new Error("Database not initiated"));
        }
        while (this.busy) {
          await new Promise((innerResolve, _reject) => {
            setTimeout(() => innerResolve(void 0), 50);
          });
        }

        const [ resolve, reject ] = usePromiseTransaction(this, res, rej);
        
        const interaction: IDBRequest<R[]> = this.db.transaction(table, "readonly").objectStore(table).getAll();
        
        interaction.onerror = (ev) => {
          reject(ev);
        };
        
        interaction.onsuccess = function(_e) {
          resolve(this.result);
        }
      });
    },
    update<K extends keyof IIndexedDocuments, R = IIndexedDocuments[K]>(table: K, payload: R): Promise<void> {
      return new Promise(async (res, rej) => {
        if (!this.db) {
          return rej(new Error("Database not initiated"));
        }
        while (this.busy) {
          await new Promise((innerResolve, _reject) => {
            setTimeout(() => innerResolve(void 0), 50);
          });
        }
        
        const [ resolve, reject ] = usePromiseTransaction(this, res, rej);

        const interaction = this.db.transaction(table, "readwrite").objectStore(table).put(payload);

        interaction.onerror = (ev) => {
          reject(ev)
        };

        interaction.onsuccess = (_e) => {
          resolve();
        }
      });
    },
    insert<K extends keyof IIndexedDocuments, R = IIndexedDocuments[K], N = Omit<R, keyof IndexedItem>>(table: K, payload: N): Promise<R> {
      return new Promise(async (res, rej) => {
        if (!this.db) {
          return rej(new Error("Database not initiated"));
        }
        while (this.busy) {
          await new Promise((innerResolve, _reject) => {
            setTimeout(() => innerResolve(void 0), 50);
          });
        }
        const [ resolve, reject ] = usePromiseTransaction(this, res, rej);

        const interaction = this.db.transaction(table, "readwrite").objectStore(table).add(payload);

        interaction.onerror = (ev) => {
          reject(ev);
        };

        interaction.onsuccess = function(_) {
          const indexObject: IndexedItem = { id: -1 };
          const resIndex = interaction.result;
          switch (typeof resIndex) {
            case "number":
              indexObject.id = resIndex;
              break;
            case "string":
              indexObject.id = parseInt(resIndex);
              break;
            default:
              return reject(new Error("Key type not readable"));
          }

          // assertion to simplify ts type (might cause issues on changes, but typescript decided to be 0Brain)
          const result = {...payload, ...indexObject} as R;
          resolve(result);
        }
      });
    },
    remove<K extends keyof IIndexedDocuments>(table: K, index: IndexType): Promise<void> {
      return new Promise(async (res, rej) => {
        if (!this.db) {
          return rej(new Error("Database not initiated"));
        }
        while (this.busy) {
          await new Promise((innerResolve, _reject) => {
            setTimeout(() => innerResolve(void 0), 50);
          });
        }
        
        const [ resolve, reject ] = usePromiseTransaction(this, res, rej);

        const interaction = this.db.transaction(table, "readwrite").objectStore(table).delete(index);
        
        interaction.onerror = (ev) => {
          reject(ev);
        }

        interaction.onsuccess = (_ev) => {
          resolve();
        }
      });
    },
    initialize(): Promise<void> {
      return new Promise(async (res, rej) => {
        while (this.busy) {
          await new Promise((innerResolve, _reject) => {
            setTimeout(() => innerResolve(void 0), 50);
          });
        }
        const [ resolve, reject ] = usePromiseTransaction(this, res, rej);

        var db = window.indexedDB.open("taskList", 3);
        db.onupgradeneeded = (_e) => {
          this.db = db.result;

          // enforcing that every database key is present for database init
          type tables = { [K in keyof IIndexedDocuments]-?: true };
          const keyed: tables = { entity: !0, task: !0 };
          const indexedTables = Object.keys(keyed);
          const keyPath: keyof IndexedItem = "id";
          for (const table of indexedTables) {
            this.db.createObjectStore(table, {keyPath, autoIncrement: true});
          }
        };

        db.onsuccess = (_e) => {
          if (!this.db) {
            this.db = db.result;
          }
          window.addEventListener("beforeunload", (_ev) => {
            if (this.busy && !this.persist) {
              this.persist = window.confirm("Transaction is in progress, are you sure you want to leave?")
            }
          });
          return resolve();
        };

        db.onerror = (err) => {
          return reject(err);
        }

        db.onblocked = (e) => {
          console.log(e);
          return reject(e);
        }
      });
    }
  }
});

const usePromiseTransaction = function<T, R, K extends SingleThreadedTasker>(
  object: K,
  resolve: (result: T | PromiseLike<T>) => void,
  reject: (reason: R) => void,
  ): [(result: T | PromiseLike<T>) => void, (reason: R) => void]
{
  object.busy = true;
  return [
    (result: T | PromiseLike<T>) => {
      object.busy = false;
      resolve(result);
    },
    (reason: R) => {
      object.busy = false;
      reject(reason);
    }
  ];
}
