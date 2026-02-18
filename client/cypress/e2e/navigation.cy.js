describe('Navigation', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/auth/verify', {
      statusCode: 200,
      body: { id: 1, name: 'Test User', email: 'test@example.com', gender: 'Male', birthday: '1995-01-01' },
    }).as('verify');

    cy.intercept('GET', '**/medications', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/moods', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/foods', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/symptoms', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/affirmations', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/insights', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/users', { statusCode: 200, body: [] });
  });

  it('navigates to settings page', () => {
    cy.visit('/settings');
    cy.wait('@verify');
    cy.url().should('include', '/settings');
  });

  it('redirects unauthenticated users to login', () => {
    cy.intercept('GET', '**/auth/verify', { statusCode: 401, body: {} }).as('verifyFail');

    cy.visit('/');
    cy.url().should('include', '/login');
  });

  it('navigates to insights page', () => {
    cy.visit('/insights');
    cy.wait('@verify');
    cy.url().should('include', '/insights');
  });
});
