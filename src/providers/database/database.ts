import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseProvider {
  private dbConnection: SQLiteObject;

  constructor(
    public sqlite: SQLite) {
    this.initDB();
  }

  static now(days = 0, midnight = false) {
    // isn't working in this SQLITE due locale

    const date = new Date();
    let dd, mm, y, h, m, s;

    if (days != 0) {
      let newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);

      dd = newDate.getDate();
      mm = newDate.getMonth() + 1;
      y = newDate.getFullYear();
      h = newDate.getHours();
      m = newDate.getMinutes();
      s = newDate.getSeconds();
    }
    else {
      dd = date.getDate();
      mm = date.getMonth() + 1;
      y = date.getFullYear();
      h = date.getHours();
      m = date.getMinutes();
      s = date.getSeconds();
    }

    if(midnight) {
      h = 0;
      m = 0;
      s = 0;
    }

    let res = [
      '' + y,
      ('0' + mm).slice(-2),
      ('0' + dd).slice(-2),
      ('0' + h).slice(-2),
      ('0' + m).slice(-2),
      ('0' + s).slice(-2)
    ];

    return res.slice(0, 3).join('-') + ' ' + res.slice(3).join(':');
  }

  static date2bd(date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const y = date.getFullYear();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    let res = [
      '' + y,
      ('0' + mm).slice(-2),
      ('0' + dd).slice(-2),
      ('0' + h).slice(-2),
      ('0' + m).slice(-2),
      ('0' + s).slice(-2)
    ];

    return res.slice(0, 3).join('-') + ' ' + res.slice(3).join(':');
  }

  get db(): SQLiteObject {
    return this.dbConnection;
  }

  private initDB() {
    console.log('init db');

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.dbConnection = db;

      //this.dropTables();
      this.createTables();
      this.loadRecords();

      console.log('db created');
    })
    .catch(e => console.error('error on load db', JSON.stringify(e)));
  }

  // Criar as tabelas
  private createTables() {
    console.log('creating tables...');

    this.dbConnection.sqlBatch([
      ["CREATE TABLE IF NOT EXISTS categories(id INTEGER PRIMARY KEY AUTOINCREMENT, \
        name VARCHAR(255) NOT NULL, color CHARACTER(11) DEFAULT '255,255,255', \
        is_default BOOLEAN);"],
      ["CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY AUTOINCREMENT, \
        amount DECIMAL NOT NULL, description TEXT, entry_at DATETIME NOT NULL, \
        latitude FLOAT, longitude FLOAT, address VARCHAR(255), image VARCHAR(255), \
        is_init BOOLEAN, category_id INTEGER);"],
    ])
    .then(() => console.log('tables created successfully'))
    .catch(e => console.error('error on create tables', JSON.stringify(e)));
  }

  // Carregar os dados padrão
  private loadRecords() {
    console.log('loading default data...');

    this.dbConnection.executeSql('SELECT COUNT(id) AS qtd FROM categories', [])
      .then((data: any) => {
        console.log('categories in db', data.rows.item(0).qtd);

        //Se não existe nenhum registro
        if (data.rows.item(0).qtd == 0) {

          // Populando as tabelas iniciais
          this.dbConnection.sqlBatch([
            ['INSERT INTO categories (name) values (?)', ['Categoria 1']],
            ['INSERT INTO categories (name) values (?)', ['Categoria 2']],
            ['INSERT INTO categories (name) values (?)', ['Categoria 3']]
          ])
          .then(() => console.log('default categories added'))
          .catch(e => console.error('error on create default categories', JSON.stringify(e)));
        }
      })
      .catch(e => console.error('error on get categories quantity', JSON.stringify(e)));
  }

  private dropTables() {
    console.log('dropping tables...');

    this.dbConnection.sqlBatch([
      ["DROP TABLE entries;"],
      ["DROP TABLE categories;"],
    ])
    .then(() => console.log('tables dropped successfully'))
    .catch(e => console.error('error on drop tables', JSON.stringify(e)));
  }
}
