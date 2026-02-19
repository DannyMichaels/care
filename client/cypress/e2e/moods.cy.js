describe('Moods', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/auth/verify', {
      statusCode: 200,
      body: { id: 1, name: 'Test User', email: 'test@example.com', gender: 'Male', birthday: '1995-01-01', email_verified: true },
    }).as('verify');

    cy.intercept('GET', '**/medications', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/moods', {
      statusCode: 200,
      body: [
        { id: 1, status: 'Good', time: new Date().toISOString(), reason: 'Feeling well', user_id: 1 },
      ],
    }).as('getMoods');
    cy.intercept('GET', '**/foods', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/symptoms', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/affirmations', { statusCode: 200, body: [] });
  });

  it('displays moods on home page', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'fake-jwt-token');
      },
    });
    cy.wait('@verify');
    cy.wait('@getMoods');
    cy.contains('Good');
  });
});
