Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.intercept('POST', '**/auth/login', {
    statusCode: 200,
    body: {
      user: {
        id: 1,
        name: 'Test User',
        email,
        gender: 'Male',
        birthday: '1995-01-01',
        email_verified: true,
      },
      token: 'fake-jwt-token',
    },
  }).as('loginRequest');

  cy.intercept('GET', '**/auth/verify', {
    statusCode: 200,
    body: {
      id: 1,
      name: 'Test User',
      email,
      gender: 'Male',
      birthday: '1995-01-01',
      email_verified: true,
    },
  }).as('verifyRequest');

  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait('@loginRequest');
});
