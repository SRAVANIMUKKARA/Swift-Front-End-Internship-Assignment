export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterState {
  search: string;
  sortColumn: 'postId' | 'name' | 'email' | null;
  sortDirection: 'asc' | 'desc' | null;
}

export type SortState = 'none' | 'asc' | 'desc';