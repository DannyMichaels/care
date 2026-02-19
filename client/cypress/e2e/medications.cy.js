describe('Medications', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/auth/verify', {
      statusCode: 200,
      body: { id: 1, name: 'Test User', email: 'test@example.com', gender: 'Male', birthday: '1995-01-01', email_verified: true },
    }).as('verify');

    cy.intercept('GET', '**/medications', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Aspirin', time: new Date().toISOString(), reason: 'Headache', user_id: 1 },
      ],
    }).as('getMeds');

    cy.intercept('GET', '**/moods', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/foods', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/symptoms', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/affirmations', { statusCode: 200, body: [] });
  });

  it('displays medications on home page', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'fake-jwt-token');
      },
    });
    cy.wait('@verify');
    cy.wait('@getMeds');
    cy.contains('Aspirin');
  });

  it('creates a new medication', () => {
    cy.intercept('POST', '**/medications', {
      statusCode: 201,
      body: { id: 2, name: 'Ibuprofen', time: new Date().toISOString(), reason: 'Pain', user_id: 1 },
    }).as('createMed');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'fake-jwt-token');
      },
    });
    cy.wait('@verify');
  });
});
