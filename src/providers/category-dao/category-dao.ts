import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class CategoryDaoProvider {
  constructor(public database: DatabaseProvider) { }

  getAll() {
    const sql = 'SELECT * FROM categories ORDER BY name';
    const data = [];

    return this.database.db
      .executeSql(sql, data)
      .then((data: any) => {
        if (data.rows.length > 0) {
          let categories: any[] = [];

          for (var i = 0; i < data.rows.length; i++) {
            const item = data.rows.item(i);
            categories.push(item);
          }

          return categories;
        }

        return null;
      })
      .catch((e) => console.error('error on get', JSON.stringify(e)));
  }
}
