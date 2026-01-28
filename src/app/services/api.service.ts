import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders(),
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.getHeaders(),
    });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.getHeaders(),
    });
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.getHeaders(),
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders(),
    });
  }

  createSequence(data: any): Observable<any> {
    return this.post("SequenceModel", data);
  }

  getSequences(page: number, pageSize: number): Observable<any> {
    return this.get(`SequenceModel?page=${page}&pageSize=${pageSize}`);
  }

  updateSequence(data: any): Observable<any> {
    return this.put("SequenceModel/update", data);
  }

  createWorkflowSequence(data: any): Observable<any> {
    return this.post("Sequence/sequence", data);
  }

  getWorkflowSequences(page: number, pageSize: number): Observable<any> {
    return this.get(`Sequence?page=${page}&pageSize=${pageSize}`);
  }

  createSequenceForm(data: any): Observable<any> {
    return this.post("SequenceForm", data);
  }

  getSequenceForms(page: number, pageSize: number): Observable<any> {
    return this.get(`SequenceForm?page=${page}&pageSize=${pageSize}`);
  }

  createSequenceStatus(data: any): Observable<any> {
    return this.post("SequenceStatus", data);
  }

  getSequenceStatuses(page: number, pageSize: number): Observable<any> {
    return this.get(`SequenceStatus?page=${page}&pageSize=${pageSize}`);
  }

  getRefundFormStatus(id: number): Observable<any> {
    return this.get(`RefundForms/${id}/status`);
  }

  getStudentRequests(studentId: number): Observable<any> {
    return this.get(`StudentRequest/${studentId}/requests`);
  }
}
