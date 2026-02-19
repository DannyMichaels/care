describe('Insights', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/auth/verify', {
      statusCode: 200,
      body: { id: 1, name: 'Test User', email: 'test@example.com', gender: 'Male', birthday: '1995-01-01', email_verified: true },
    }).as('verify');

    cy.intercept('GET', /localhost:3005\/insights/, {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Test Insight',
          description: 'A test insight',
          body: 'Body text',
          user: { id: 1, name: 'Test User', gender: 'Male' },
          comments: [],
          likes: [],
          created_at: new Date().toISOString(),
        },
      ],
    }).as('getInsights');
  });

  it('displays community insights', () => {
    cy.visit('/insights', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'fake-jwt-token');
      },
    });
    cy.wait('@verify');
    cy.wait('@getInsights');
    cy.contains('Test Insight');
  });

  it('creates a new insight', () => {
    cy.intercept('POST', '**/insights', {
      statusCode: 201,
      body: {
        id: 2,
        title: 'New Insight',
        description: 'Description',
        body: 'Body',
        user: { id: 1, name: 'Test User' },
      },
    }).as('createInsight');

    cy.visit('/insights', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'fake-jwt-token');
      },
    });
    cy.wait('@verify');
    cy.wait('@getInsights');
  });
});
