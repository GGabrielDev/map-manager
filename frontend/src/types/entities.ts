// Entity type definitions

export interface State {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  Municipalities?: Municipality[];
}

export interface Municipality {
  id: number;
  name: string;
  stateId: number;
  createdAt: string;
  updatedAt: string;
}

export interface StateFormDialogProps {
  open: boolean;
  state: State | null;
  onClose: () => void;
  onSuccess: () => void;
  canEdit: boolean;
  canCreate: boolean;
}

export interface StatesTableProps {
  states: State[];
  canEditState: boolean;
  canDeleteState: boolean;
  onEdit: (state: State) => void;
  onDelete: (stateId: number) => void;
}

export interface StateFormData {
  name: string;
}

export interface StateFilterOptions {
  page: number;
  pageSize: number;
  name?: string;
  sortBy?: 'name' | 'creationDate' | 'updatedOn';
  sortOrder?: 'ASC' | 'DESC';
}
