import { DeleteSolutionAsset } from '../../../../../src/app/modules/mapsmap/assets/delete_solution_asset';

describe('DeleteSolutionAsset', () => {
  let transactionAsset: DeleteSolutionAsset;

	beforeEach(() => {
		transactionAsset = new DeleteSolutionAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(6);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('deleteSolution');
		});

		it('should have valid schema', () => {
			expect(transactionAsset.schema).toMatchSnapshot();
		});
	});

	describe('validate', () => {
		describe('schema validation', () => {
      it.todo('should throw errors for invalid schema');
      it.todo('should be ok for valid schema');
    });
	});

	describe('apply', () => {
    describe('valid cases', () => {
      it.todo('should update the state store');
    });

    describe('invalid cases', () => {
      it.todo('should throw error');
    });
	});
});
