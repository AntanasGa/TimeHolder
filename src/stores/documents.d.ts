export interface IIndexedDocuments {
  task: ITask,
  entity: IEntity,
}

export type CacheTypes = { [K in keyof IIndexedDocuments]?: IIndexedDocuments[K][]};

export interface ITask extends IndexedItem {
  taskName: string,
  taskLink: string,
}

export interface IEntity extends IndexedItem {
  taskId: number,
  startTime: number,
  endTime?: number,
  comment?: string,
}

export interface IndexedItem {
  id: IndexType,
}

export type IndexType = number;
