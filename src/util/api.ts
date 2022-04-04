import fetch, { Headers, HeadersInit, RequestInit } from 'node-fetch';
import { Stringifiable, stringify } from 'query-string';

const baseUrl = ``;

type Opts = {
  param?: unknown;
  queryParams?: unknown;
  body?: unknown;
  headers?: HeadersInit;
};

/**
 * Mirror Axios Response Schema
 * https://axios-http.com/docs/res_schema
 */
export interface APIResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export class APIError extends Error {
  constructor(
    public response: {
      status: number;
      statusText: string;
      headers: Headers;
      message: string;
    }
  ) {
    super(response.statusText);
    this.name = 'API Error Response';
    this.response = response;
  }
}

export async function client<T>(
  endpoint: string,
  method: 'GET' | 'PUT' | 'POST',
  options?: Opts
): Promise<APIResponse<T>> {
  if (!options) options = {};
  const { param, queryParams, body, headers } = options;
  let url = baseUrl ? `${baseUrl}/${endpoint}` : endpoint;
  if (param) url += `/${param}`;
  if (queryParams)
    url += `?${stringify(
      queryParams as Record<
        string,
        string | number | boolean | readonly Stringifiable[]
      >
    )}`;

  const config: RequestInit = {
    method,
    headers: headers ? headers : {}
    // headers: {
    //   Authorization: `Bearer ${process.env.AUTH}`
    // }
  };

  if (body) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  const contentType = response.headers.get('content-type');
  let data: T;
  if (contentType && contentType.includes('application/json'))
    data = (await response.json()) as T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else data = response.body ? ((await response.text()) as any) : {};
  if (response.ok) {
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };
  } else {
    console.log(response);
    throw new APIError({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      message: (data as unknown as { message: string }).message
    });
  }
}

export interface WeatherResponse {
  '@context': Array<ContextClass | string>;
  type: string;
  features: Feature[];
  title: string;
  updated: Date;
}

export interface ContextClass {
  '@version': string;
  wx: string;
  '@vocab': string;
}

export interface Feature {
  id: string;
  type: TypeEnum;
  geometry: null;
  properties: Properties;
}

export interface Properties {
  '@id': string;
  '@type': Type;
  id: string;
  areaDesc: string;
  geocode: Geocode;
  affectedZones: string[];
  references: Reference[];
  sent: Date;
  effective: Date;
  onset: Date;
  expires: Date;
  ends: Date;
  status: Status;
  messageType: MessageType;
  category: Category;
  severity: Severity;
  certainty: Certainty;
  urgency: Urgency;
  event: string;
  sender: Sender;
  senderName: SenderName;
  headline: string;
  description: string;
  instruction: null | string;
  response: Response;
  parameters: Parameters;
}

export enum Type {
  WxAlert = 'wx:Alert'
}

export enum Category {
  Met = 'Met'
}

export enum Certainty {
  Likely = 'Likely',
  Possible = 'Possible'
}

export interface Geocode {
  SAME: string[];
  UGC: string[];
}

export enum MessageType {
  Alert = 'Alert',
  Update = 'Update'
}

export interface Parameters {
  AWIPSidentifier: AWIPSidentifier[];
  WMOidentifier: string[];
  BLOCKCHANNEL: Blockchannel[];
  'EAS-ORG'?: string[];
  VTEC: string[];
  eventEndingTime: Date[];
  NWSheadline?: string[];
  expiredReferences?: string[];
}

export enum AWIPSidentifier {
  Cfwmob = 'CFWMOB',
  Npwmob = 'NPWMOB',
  Wcnmob = 'WCNMOB'
}

export enum Blockchannel {
  Cmas = 'CMAS',
  EAS = 'EAS',
  Nwem = 'NWEM'
}

export interface Reference {
  '@id': string;
  identifier: string;
  sender: Sender;
  sent: Date;
}

export enum Sender {
  WNwsWebmasterNoaaGov = 'w-nws.webmaster@noaa.gov'
}

export enum Response {
  Avoid = 'Avoid',
  Execute = 'Execute',
  Monitor = 'Monitor'
}

export enum SenderName {
  NWSMobileAL = 'NWS Mobile AL'
}

export enum Severity {
  Extreme = 'Extreme',
  Minor = 'Minor',
  Moderate = 'Moderate'
}

export enum Status {
  Actual = 'Actual'
}

export enum Urgency {
  Expected = 'Expected',
  Future = 'Future'
}

export enum TypeEnum {
  Feature = 'Feature'
}
