import { Knex } from 'knex';
import { PartyMapItem, IOracleDb } from '../../domain/types';
import { logger } from '../../shared/logger';
import { NotFoundError } from '../errors';

export { PartyMapItem }; // todo: remove this after changing imports in other files to use domain/types

/*
 * Class to abstract PartyMapItem DB operations
 */
export class OracleDB implements IOracleDb {
  // Knex instance
  private Db: Knex;
  private log = logger.push({ component: OracleDB.name }); // todo: pass through ctor

  public constructor(dbInstance: Knex) {
    this.Db = dbInstance;
  }

  // Add initial PartyMapItem parameters
  // Error bubbles up in case of primary key violation
  public async insert(item: PartyMapItem | Array<PartyMapItem>): Promise<boolean> {
    try {
      // Returns [0] for MySQL-Knex and [Row Count] for SQLite-Knex
      const inserted = await this.Db<PartyMapItem>('oracleMSISDN').insert(item);
      this.log.push({ inserted }).debug('db.insert is done');

      return true;
    } catch (err: unknown) {
      this.log.warn('error in db.insert', err);
      throw err;
    }
  }

  // Update PartyMapItem
  public async update(partyMapItem: PartyMapItem): Promise<number> {
    try {
      // Returns number of updated rows
      // Transaction to make the update atomic
      return await this.Db.transaction(async (trx): Promise<number> => {
        // Transaction is rolled back automatically if there is
        // an error and the returned promise is rejected
        let selectQuery = trx<PartyMapItem>('oracleMSISDN').select('*').where({ id: partyMapItem.id }).limit(1);

        if (partyMapItem.subId !== undefined) {
          selectQuery = selectQuery.andWhere('subId', partyMapItem.subId);
        }
        const partyMapItems: PartyMapItem[] = await selectQuery;

        if (partyMapItems.length === 0) {
          throw new NotFoundError('oracleMSISDN', partyMapItem.id);
        }

        const existingItem: PartyMapItem = partyMapItems[0];
        const updatedItem: Record<string, string | Date> = {};

        // Prepare a new Item with only allowable updates
        Object.keys(existingItem).forEach((key): void => {
          updatedItem[key] = partyMapItem[key as keyof PartyMapItem] as string | Date;
        });

        let updateQuery = trx<PartyMapItem>('oracleMSISDN').where({ id: partyMapItem.id }).update(updatedItem);

        if (partyMapItem.subId !== undefined) {
          updateQuery = updateQuery.andWhere('subId', partyMapItem.subId);
        }

        return updateQuery;
      });
    } catch (err: unknown) {
      this.log.warn('error in db.update', err);
      throw err;
    }
  }

  // Retrieve PartyMapItem by ID and subId (unique)
  // Incase of multiple rows, return the first one
  public async retrieve(id: string, subId?: string): Promise<PartyMapItem> {
    try {
      // Returns array containing PartyMapItems
      let query = this.Db<PartyMapItem>('oracleMSISDN').select('*').where('id', id).limit(1);

      if (subId !== undefined) {
        query = query.andWhere('subId', subId);
      }
      const partyMapItems: PartyMapItem[] = await query;

      if (partyMapItems.length === 0) {
        throw new NotFoundError('oracleMSISDN', id);
      }
      const returnItem: PartyMapItem = partyMapItems[0];
      if (returnItem.subId === '') {
        delete returnItem.subId;
      }

      return returnItem;
    } catch (err: unknown) {
      this.log.warn('error in db.retrieve: ', err);
      throw err;
    }
  }

  // Delete PartyMapItem by ID
  // Deleting PartyMapItem automatically deletes associates scopes
  public async delete(id: string, subId?: string): Promise<number> {
    try {
      // Returns number of deleted rows
      let deleteQuery = this.Db<PartyMapItem>('oracleMSISDN').where({ id: id }).del();

      if (subId !== undefined) {
        deleteQuery = deleteQuery.andWhere('subId', subId);
      }
      const deleteCount: number = await deleteQuery;

      if (deleteCount === 0) {
        throw new NotFoundError('oracleMSISDN', id);
      }

      return deleteCount;
    } catch (err: unknown) {
      this.log.warn('error in db.delete: ', err);
      throw err;
    }
  }

  public async isConnected(): Promise<boolean> {
    try {
      await this.Db.raw('SELECT 1');
      this.log.verbose('db connection is ok');
      return true;
    } catch (err: unknown) {
      this.log.warn('db connection check failed: ', err);
      return false;
    }
  }

  public isDuplicationError(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ER_DUP_ENTRY';
  }
}
