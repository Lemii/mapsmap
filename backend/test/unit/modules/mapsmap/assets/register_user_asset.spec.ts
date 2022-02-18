import { RegisterUserAsset } from '../../../../../src/app/modules/mapsmap/assets/register_user_asset';

describe('RegisterUserAsset', () => {
  let transactionAsset: RegisterUserAsset;

	beforeEach(() => {
		transactionAsset = new RegisterUserAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(200);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('registerUser');
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
