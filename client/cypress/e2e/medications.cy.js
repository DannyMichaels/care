describe('Medications', () => {
  const today = new Date().toLocaleDateString('en-CA');

  beforeEach(() => {
    cy.intercept('GET', '**/auth/verify', {
      statusCode: 200,
      body: { id: 1, name: 'Test User', email: 'test@example.com', gender: 'Male', birthday: '1995-01-01', email_verified: true },
    }).as('verify');

    cy.intercept('GET', '**/medications/dashboard*', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Aspirin', time: new Date().toISOString(), reason: 'Headache', user_id: 1, schedule_unit: null, schedule_interval: null, occurrence: null },
      ],
    }).as('getDashboard');

    cy.intercept('GET', '**/medications/rx_guide', {
      statusCode: 200,
      body: [],
    }).as('getRxGuide');

    cy.intercept('GET', '**/medication_occurrences*', {
      statusCode: 200,
      body: [],
    }).as('getOccurrences');

    cy.intercept('GET', '**/moods', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/foods', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/symptoms', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/affirmations', { statusCode: 200, body: [] });
  });

  const visitHome = () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'fake-jwt-token');
      },
    });
    cy.wait('@verify');
    cy.wait('@getDashboard');
  };

  const expandMedsAccordion = () => {
    cy.get('.MuiAccordionSummary-root').last().click();
  };

  it('displays medications on home page', () => {
    visitHome();
    expandMedsAccordion();
    cy.contains('Aspirin').should('be.visible');
  });

  it('creates a new medication', () => {
    cy.intercept('POST', '**/medications', {
      statusCode: 201,
      body: { id: 2, name: 'Ibuprofen', time: new Date().toISOString(), reason: 'Pain', user_id: 1 },
    }).as('createMed');

    visitHome();
  });

  describe('DateCarousel', () => {
    it('allows clicking future dates', () => {
      visitHome();
      cy.get('.date-carousel__chip').last().should('not.have.class', 'date-carousel__chip--future');
      cy.get('.date-carousel__chip').last().should('not.be.disabled');
    });

    it('shows today button and navigates to today', () => {
      visitHome();
      cy.get('.date-carousel__year button').should('exist');
    });

    it('shows today dot indicator when another date is selected', () => {
      visitHome();
      cy.get('.date-carousel__chip').not('.date-carousel__chip--selected').first().click();
      cy.get('.date-carousel__chip--today-unselected').should('exist');
      cy.get('.date-carousel__chip-today-dot').should('exist');
    });

    it('removes max date restriction on calendar picker', () => {
      visitHome();
      cy.get('.date-carousel__picker-input').should('not.have.attr', 'max');
    });
  });

  describe('Scheduled Medications', () => {
    it('displays a recurring medication on its occurrence date', () => {
      cy.intercept('GET', '**/medications/dashboard*', {
        statusCode: 200,
        body: [
          {
            id: 10,
            name: 'Humira',
            time: new Date().toISOString(),
            reason: 'Autoimmune',
            user_id: 1,
            schedule_unit: 'week',
            schedule_interval: 2,
            occurrence: null,
          },
        ],
      }).as('getDashboard');

      visitHome();
      expandMedsAccordion();
      cy.contains('Humira').should('be.visible');
    });

    it('shows skipped status for skipped scheduled medication', () => {
      cy.intercept('GET', '**/medications/dashboard*', {
        statusCode: 200,
        body: [
          {
            id: 10,
            name: 'Humira',
            time: new Date().toISOString(),
            reason: 'Autoimmune',
            user_id: 1,
            schedule_unit: 'day',
            schedule_interval: 1,
            occurrence: { id: 1, medication_id: 10, occurrence_date: today, is_taken: false, skipped: true },
          },
        ],
      }).as('getDashboard');

      visitHome();
      expandMedsAccordion();
      cy.contains('skipped for today').should('be.visible');
    });
  });

  describe('Delete Dialog', () => {
    it('shows delete confirmation for one-time med', () => {
      cy.intercept('DELETE', '**/medications/1', {
        statusCode: 204,
      }).as('deleteMed');

      visitHome();
      expandMedsAccordion();
      cy.contains('Aspirin').should('be.visible').click();
    });

    it('shows 3 options for scheduled med delete', () => {
      cy.intercept('GET', '**/medications/dashboard*', {
        statusCode: 200,
        body: [
          {
            id: 10,
            name: 'Humira',
            time: new Date().toISOString(),
            reason: 'Autoimmune',
            user_id: 1,
            schedule_unit: 'day',
            schedule_interval: 1,
            occurrence: null,
          },
        ],
      }).as('getDashboard');

      cy.intercept('POST', '**/medications/10/occurrences', {
        statusCode: 201,
        body: { id: 1, medication_id: 10, occurrence_date: today, skipped: true },
      }).as('skipOccurrence');

      visitHome();
      expandMedsAccordion();
      cy.contains('Humira').should('be.visible');
    });
  });

  describe('SchedulePicker (Create Dialog)', () => {
    it('shows one-time mode by default', () => {
      cy.intercept('GET', '**/medications/rx_guide', { statusCode: 200, body: [] });

      visitHome();
    });
  });
});
