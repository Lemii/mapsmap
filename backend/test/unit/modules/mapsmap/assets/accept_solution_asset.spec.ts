import { AcceptSolutionAsset } from '../../../../../src/app/modules/mapsmap/assets/accept_solution_asset';

describe('AcceptSolutionAsset', () => {
  let transactionAsset: AcceptSolutionAsset;

	beforeEach(() => {
		transactionAsset = new AcceptSolutionAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(7);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('acceptSolution');
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
