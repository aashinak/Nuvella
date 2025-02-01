interface DBConfig {
    url: string;
}

export interface Config {
    development: DBConfig;
    test: DBConfig;
    production: DBConfig;
}