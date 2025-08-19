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
  state?: State;
  parishes?: Parish[];
}

export interface Parish {
  id: number;
  name: string;
  municipalityId: number;
  createdAt: string;
  updatedAt: string;
  municipality?: Municipality;
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

export interface MunicipalityFormDialogProps {
  open: boolean;
  municipality: Municipality | null;
  onClose: () => void;
  onSuccess: () => void;
  canEdit: boolean;
  canCreate: boolean;
  canGetState: boolean;
}

export interface MunicipalitiesTableProps {
  municipalities: Municipality[];
  canEditMunicipality: boolean;
  canDeleteMunicipality: boolean;
  onEdit: (municipality: Municipality) => void;
  onDelete: (municipalityId: number) => void;
}

export interface MunicipalityFormData {
  name: string;
  stateId: number | null;
}

export interface MunicipalityFilterOptions {
  page: number;
  pageSize: number;
  name?: string;
  sortBy?: 'name' | 'creationDate' | 'updatedOn';
  sortOrder?: 'ASC' | 'DESC';
}

export interface ParishFormDialogProps {
  open: boolean;
  parish: Parish | null;
  onClose: () => void;
  onSuccess: () => void;
  canEdit: boolean;
  canCreate: boolean;
  canGetMunicipality: boolean;
}

export interface ParishesTableProps {
  parishes: Parish[];
  canEditParish: boolean;
  canDeleteParish: boolean;
  onEdit: (parish: Parish) => void;
  onDelete: (parishId: number) => void;
}

export interface ParishFormData {
  name: string;
  municipalityId: number | null;
}

export interface ParishFilterOptions {
  page: number;
  pageSize: number;
  name?: string;
  municipalityId?: number;
  sortBy?: 'name' | 'creationDate' | 'updatedOn';
  sortOrder?: 'ASC' | 'DESC';
}

export interface Organism {
  id: number;
  name: string;
  icono?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganismFormDialogProps {
  open: boolean;
  organism: Organism | null;
  onClose: () => void;
  onSuccess: () => void;
  canEdit: boolean;
  canCreate: boolean;
}

export interface OrganismsTableProps {
  organisms: Organism[];
  canEditOrganism: boolean;
  canDeleteOrganism: boolean;
  onEdit: (organism: Organism) => void;
  onDelete: (organismId: number) => void;
}

export interface OrganismFormData {
  name: string;
  icono?: File | null;
}

export interface OrganismFilterOptions {
  page: number;
  pageSize: number;
  name?: string;
  sortBy?: 'name' | 'creationDate' | 'updatedOn';
  sortOrder?: 'ASC' | 'DESC';
}
