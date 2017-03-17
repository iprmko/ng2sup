
export interface IAppConfig {
  server: string;
  api: string;
}

export const defaultAppConfig: IAppConfig = {
  server: "http://localhost:9000",
  api: "api/v1"
};
