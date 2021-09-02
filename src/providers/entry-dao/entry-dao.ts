import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { DatePipe } from '@angular/common';

@Injectable()
export class EntryDaoProvider {
  datePipe = new DatePipe('en_US');
  
  constructor(public database: DatabaseProvider) { }

  insert(amount, categoryId, description, entryAt, latitude, longitude, address, image) {
    const newEntryAt = (entryAt) ? DatabaseProvider.date2bd(entryAt) : DatabaseProvider.now();
    const newDescription = (description) ? description : `Lançamento em ${this.datePipe.transform(newEntryAt)}`;

    const sql = 'INSERT INTO entries (amount, entry_at, category_id, description, latitude, longitude, address, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const data = [amount, newEntryAt, categoryId, newDescription, latitude, longitude, address, image];

    return this.database.db
      .executeSql(sql, data)
      .catch(e => console.error('erro ao inserir na tabela', JSON.stringify(e)));
  }

  update(entry, id) {
    const sql = 'UPDATE entries set amount = ?, category_id = ? WHERE id = ?';
    const data = [entry['amount'], entry['category_id'], id];

    return this.database.db
      .executeSql(sql, data)
      .catch((e) => console.error('error on update', JSON.stringify(e)));
  }

  delete(id) {
    const sql = 'DELETE FROM entries WHERE id = ?';
    const data = [id];

    return this.database.db
      .executeSql(sql, data)
      .catch((e) => console.error('error on delete', JSON.stringify(e)));
  }

  deleteAll() {
    const sql = 'DELETE FROM entries';
    const data = [];

    return this.database.db
      .executeSql(sql, data)
      .catch((e) => console.error('error on deleteAll', JSON.stringify(e)));
  }

  get(id) {
    const sql = 'SELECT * FROM entries WHERE id = ?';
    const data = [id];

    return this.database.db
      .executeSql(sql, data)
      .then((data: any) => {
        if (data.rows.length > 0) {
          return data.rows.item(0);
        }

        return null;
      })
      .catch((e) => console.error('error on get', JSON.stringify(e)));
  }

  getAll(criteria = '', data = []) {
    let sql = 'SELECT * FROM entries ';
    let newData = [].concat(data);

    if (criteria != '') {
      sql += ` WHERE ${criteria} `;
    }

    sql += ' ORDER BY entry_at';

    return this.database.db
      .executeSql(sql, newData)
        .then((data: any) => {
          if (data.rows.length > 0) {
            let entries: any[] = [];

            for (var i = 0; i < data.rows.length; i++) {
              entries.push(data.rows.item(i));
            }

            return entries;
          } else {
            return [];
          }
        })
        .catch((e) => console.error('error on get', JSON.stringify(e)));
  }

  getByDate(criteria = '', data = []) {
    let sql = "SELECT c.name AS category_name, c.color AS category_color, \
                 strftime('%Y-%m-%d', entry_at) AS entry_date, SUM(amount) AS balance \
                 FROM entries e INNER JOIN categories c ON (e.category_id = c.id)";

    let newData = [].concat(data);

    if (criteria != '') {
      sql += ` WHERE ${criteria} `;
    }

    sql += "GROUP BY entry_date \
            ORDER BY balance DESC";

    console.log('entry-dao: getByDate - ', sql);
    console.log('entry-dao: getByDate - ', JSON.stringify(newData));

    return this.database.db
      .executeSql(sql, newData)
      .then((data: any) => {
        if (data.rows.length > 0) {
          let entries: any[] = [];

          for (var i = 0; i < data.rows.length; i++) {
            entries.push(data.rows.item(i));
          }

          return entries;
        } else {
          return [];
        }
      })
      .catch((e) => console.error('error on getByCategory', JSON.stringify(e)));
  }

  getByCategory(criteria = '', data = []) {
    let sql = 'SELECT c.name AS category_name, c.color AS category_color, SUM(e.amount) AS balance \
               FROM entries e INNER JOIN categories c ON (e.category_id = c.id)';

    let newData = [].concat(data);

    if (criteria != '') {
      sql += ` WHERE ${criteria} `;
    }

    sql += ' GROUP BY category_name \
             ORDER BY balance DESC';

    return this.database.db
      .executeSql(sql, newData)
      .then((data: any) => {
        if (data.rows.length > 0) {
          let entries: any[] = [];

          for (var i = 0; i < data.rows.length; i++) {
            entries.push(data.rows.item(i));
          }

          return entries;
        } else {
          return [];
        }
      })
      .catch((e) => console.error('error on getByCategory', JSON.stringify(e)));
  }
  getBalance() {
    const sql = 'SELECT SUM(amount) AS balance FROM entries';
    const data = [];

    return this.database.db
      .executeSql(sql, data)
      .then((data: any) => {
        if (data.rows.length > 0) {
          const item = data.rows.item(0);
          return item.balance;
        }

        return 0;
      })
      .catch((e) => console.error('error on getBalance', JSON.stringify(e)));
  }
}
