import { Injectable } from '@angular/core';
import { EntryDaoProvider } from '../entry-dao/entry-dao';
import { CategoryDaoProvider } from '../category-dao/category-dao';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class AccountProvider {
  private balance = 0;

  constructor(
    public entryDao: EntryDaoProvider,
    public categoryDao: CategoryDaoProvider) { }

  // Calcula o saldo inicial
  loadBalance() {
    console.log('load balance');

    return this.entryDao
      .getBalance()
        .then((balance) => {
          this.balance = Number(balance)
          return this.balance;
        });
  }

  // Adiciona um novo lançamento
  addEntry(amount, categoryId, description = null, entryAt = null, latitude = 0, longitude = 0, address = null, image = null) {
    this.balance += Number(amount);

    return this.entryDao
      .insert(amount, categoryId, description, entryAt, latitude, longitude, address, image)
        .then(() => console.log('new entry added'));
  }

  // Retorna o saldo atual
  currentBalance() {
    return this.balance;
  }

  allEntries() {
    return this.entryDao.getAll();
  }

  lastEntries(days, categories = []) {
    let criteria = 'entry_at >= ?';
    let data = [DatabaseProvider.now(days, true)]

    if (categories.length > 0) {
      let criteriaCategories = [];
      
      for(let categoryID of categories.map(item => item.id)) {
        criteriaCategories.push('category_id = ?');
        data.push(categoryID);
      }

      criteria += ` AND (${criteriaCategories.join(" OR ")})`;
    }

    console.log('lastEntries ', JSON.stringify(criteria));

    return this.entryDao.getAll(criteria, data);
  }

  lastEntriesByDate(days, categories = []) {
    let criteria = 'entry_at >= ?';
    let data = [DatabaseProvider.now(days, true)]

    if (categories.length > 0) {
      let criteriaCategories = [];
      
      for(let categoryID of categories.map(item => item.id)) {
        criteriaCategories.push('category_id = ?');
        data.push(categoryID);
      }

      criteria += ` AND (${criteriaCategories.join(" OR ")})`;
    }

    console.log('lastEntriesByDate ', JSON.stringify(criteria));

    return this.entryDao
      .getByDate(criteria, data);
  }

  lastEntriesByCategory(days, categories = []) {
    let criteria = 'entry_at >= ?';
    let data = [DatabaseProvider.now(days, true)]

    if (categories.length > 0) {
      let criteriaCategories = [];
      
      for(let categoryID of categories.map(item => item.id)) {
        criteriaCategories.push('category_id = ?');
        data.push(categoryID);
      }

      criteria += ` AND (${criteriaCategories.join(" OR ")})`;
    }

    console.log('lastEntriesByCategory ', JSON.stringify(criteria));

    return this.entryDao.getByCategory(criteria, data);
  }
}
