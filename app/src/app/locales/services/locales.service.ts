import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthService } from './../../auth';
import { API_BASE_URL } from './../../app.constants';

@Injectable()
export class LocalesService {

    private _locales = new BehaviorSubject([]);
    public locales = this._locales.asObservable();

    constructor(private http: Http, private auth: AuthService) { }

    createLocale(projectId: number, locale) {
        let request = this.http.post(
            `${API_BASE_URL}/projects/${projectId}/locales`,
            JSON.stringify(locale),
            { headers: this.getApiHeaders() }
        )
            .map(res => res.json())
            .map(res => {
                let locale = res.payload;
                if (!locale) {
                    throw new Error("no locale in response");
                }
                return locale;
            }
            ).share();

        request.subscribe(locale => {
            this._locales.next(this._locales.getValue().concat(locale));
        });

        return request;
    }

    updateLocalePairs(projectId: number, localeIdent: string, pairs) {
        return this.http.patch(
            `${API_BASE_URL}/projects/${projectId}/locales/${localeIdent}/pairs`,
            JSON.stringify(pairs),
            { headers: this.getApiHeaders() }
        )
            .map(res => res.json())
            .map(res => {
                let payload = res.payload;
                if (!payload) {
                    throw new Error("no payload in response");
                }
                return payload;
            }).share();
    }

    fetchLocales(projectId: number) {
        let request = this.http.get(
            `${API_BASE_URL}/projects/${projectId}/locales`,
            { headers: this.getApiHeaders() }
        )
            .map(res => res.json())
            .map(res => {
                let locales = res.payload;
                if (!locales) {
                    throw new Error("no locales in response");
                }
                return locales;
            }).share();

        request.subscribe(locales => {
            this._locales.next(locales);
        });

        return request;
    }

    fetchLocale(projectId: number, localeIdent: string) {
        let request = this.http.get(
            `${API_BASE_URL}/projects/${projectId}/locales/${localeIdent}`,
            { headers: this.getApiHeaders() }
        )
            .map(res => res.json())
            .map(res => {
                let locale = res.payload;
                if (!locale) {
                    throw new Error("no locale in response");
                }
                return locale;
            }).share();

        return request;
    }

    private getApiHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.auth.getToken());
        return headers;
    }
}