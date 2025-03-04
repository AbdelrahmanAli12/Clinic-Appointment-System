const { Result, ResultOperation } = require('../src/Common');
const Users = require('../src/Users/Schema');
const { getUsers, createUser } = require('../src/Users/Services');

jest.mock('../src/Users/Schema', () => ({
  create: jest.fn(),
  find: jest.fn(),
}));

describe('User Services', () => {
  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userInfo = {
        username: 'your_username',
        password: 'your_password',
        name: 'Full Name',
        phone: 1234567890,
        email: 'user@example.com',
        role: 'healthcareUser',
        address: [
          {
            street: '123 Main St',
            city: 'City',
            state: 'State',
            postalCode: '12345',
            country: 'Country',
          },
        ],
      };

      Users.create.mockResolvedValue(userInfo);

      const result = await createUser(userInfo);

      expect(result.operation).toBe(ResultOperation.Success);
      expect(result.message).toBe(`${userInfo.name} created successfully!`);
    });
  });
});
