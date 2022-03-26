import { EntityManager, getConnection, QueryRunner } from 'typeorm';
import { SixShopException } from '../model';

export const TransactionBlock = async (
  input: any,
  func: (input: any, entityManager: EntityManager) => Promise<any>,
  errorHandler?: (err: any) => void,
): Promise<any> => {
  const queryRunner: QueryRunner = getConnection().createQueryRunner();
  try {
    await queryRunner.startTransaction();

    const entityManager: EntityManager = queryRunner.manager;

    const result = await func(input, entityManager);

    await queryRunner.commitTransaction();

    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    if (errorHandler != null) errorHandler(error);
    else {
      return SixShopException.processException(error);
    }
  } finally {
    await queryRunner.release();
  }
};
