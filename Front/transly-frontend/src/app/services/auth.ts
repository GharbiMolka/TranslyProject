import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface LoginDTO {
  email: string;
  mdp: string;
}   
export interface UserDTO {
  nom: string;
  prenom: string;
  email: string;
  mdp: string;
  adresse: string;
  gouvernorat: string;
  ville: string;
  role: string;
  tel: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7267/api/auth/login'; 
  private baseUrl = 'https://localhost:7267/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: LoginDTO): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }

  register(userData: UserDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  updateUser(id: number, userData: UserDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, userData);
  }

     getUserById(id: number): Observable<UserDTO> {
  return this.http.get<UserDTO>(`${this.baseUrl}/${id}`);
}

  setUserSession(userId: number, role: string, token: string): void {
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('role', role);
    localStorage.setItem('token', token);
  }

  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id) : null;
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }



  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearSession(): void {
    localStorage.clear();
  }

  logout(): void {
    this.clearSession();
    
  }
  
getUser(): any {
  const userJson = localStorage.getItem('user'); // ou sessionStorage
  return userJson ? JSON.parse(userJson) : null;
}

requestPasswordReset(email: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/request-password-reset`, { email });
}
resetPassword(token: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/reset-password`, {
    token,
    nouveauMdp: newPassword
  });
}

}

