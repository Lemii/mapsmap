import { ChangeFlagAsset } from '../../../../../src/app/modules/mapsmap/assets/change_flag_asset';

describe('ChangeFlagAsset', () => {
  let transactionAsset: ChangeFlagAsset;

	beforeEach(() => {
		transactionAsset = new ChangeFlagAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(8);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('changeFlag');
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
