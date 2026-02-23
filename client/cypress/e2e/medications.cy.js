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
    const toggleOptionsAndClickDelete = () => {
      expandMedsAccordion();
      // Click the settings gear icon to show edit/delete buttons
      cy.get('.MuiAccordionSummary-root').last().find('.MuiIconButton-root').first().click({ force: true });
      // Click the delete icon button on the card
      cy.get('.MuiIconButton-colorSecondary').first().click();
    };

    it('shows simple confirmation for one-time med', () => {
      visitHome();
      toggleOptionsAndClickDelete();

      cy.contains('Are you sure you want to delete').should('be.visible');
      cy.get('.MuiDialog-root').within(() => {
        cy.contains('Cancel').should('be.visible');
        cy.contains('Delete').should('be.visible');
        cy.contains('Stop after today').should('not.exist');
        cy.contains('Skip this day').should('not.exist');
      });
    });

    it('closes dialog on Cancel for one-time med', () => {
      visitHome();
      toggleOptionsAndClickDelete();

      cy.get('.MuiDialog-root').within(() => {
        cy.contains('Cancel').click();
      });

      cy.get('.MuiDialog-root').should('not.exist');
    });

    it('calls delete API when confirming one-time med delete', () => {
      cy.intercept('DELETE', '**/medications/1', {
        statusCode: 204,
      }).as('deleteMed');

      visitHome();
      toggleOptionsAndClickDelete();

      cy.get('.MuiDialog-root').within(() => {
        cy.contains('Delete').click();
      });

      cy.wait('@deleteMed');
    });

    describe('scheduled med', () => {
      beforeEach(() => {
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
      });

      const openScheduledDeleteDialog = () => {
        expandMedsAccordion();
        cy.get('.MuiAccordionSummary-root').last().find('.MuiIconButton-root').first().click({ force: true });
        cy.get('.MuiIconButton-colorSecondary').first().click();
      };

      it('shows 3 options plus Cancel for scheduled med', () => {
        visitHome();
        openScheduledDeleteDialog();

        cy.get('.MuiDialog-root').within(() => {
          cy.contains('What would you like to do with').should('be.visible');
          cy.contains('Skip this day').should('be.visible');
          cy.contains('Stop after today').should('be.visible');
          cy.contains('Delete medication').should('be.visible');
          cy.contains('Cancel').should('be.visible');
        });
      });

      it('shows hint text under Stop after today', () => {
        visitHome();
        openScheduledDeleteDialog();

        cy.get('.MuiDialog-root').within(() => {
          cy.contains('Still shows today, stops appearing tomorrow').should('be.visible');
        });
      });

      it('calls skip occurrence API when Skip this day is clicked', () => {
        cy.intercept('POST', '**/medications/10/occurrences', {
          statusCode: 201,
          body: { id: 1, medication_id: 10, occurrence_date: today, skipped: true },
        }).as('skipOccurrence');

        visitHome();
        openScheduledDeleteDialog();

        cy.get('.MuiDialog-root').within(() => {
          cy.contains('Skip this day').click();
        });

        cy.wait('@skipOccurrence');
      });

      it('calls update API when Stop after today is clicked', () => {
        cy.intercept('PUT', '**/medications/10', {
          statusCode: 200,
          body: { id: 10, name: 'Humira', schedule_end_date: today },
        }).as('stopMed');

        visitHome();
        openScheduledDeleteDialog();

        cy.get('.MuiDialog-root').within(() => {
          cy.contains('Stop after today').click();
        });

        cy.wait('@stopMed');
      });

      it('calls delete API when Delete medication is clicked', () => {
        cy.intercept('DELETE', '**/medications/10', {
          statusCode: 204,
        }).as('deleteMed');

        visitHome();
        openScheduledDeleteDialog();

        cy.get('.MuiDialog-root').within(() => {
          cy.contains('Delete medication').click();
        });

        cy.wait('@deleteMed');
      });

      it('closes dialog on Cancel', () => {
        visitHome();
        openScheduledDeleteDialog();

        cy.get('.MuiDialog-root').within(() => {
          cy.contains('Cancel').click();
        });

        cy.get('.MuiDialog-root').should('not.exist');
      });
    });
  });

  describe('SchedulePicker (Create Dialog)', () => {
    it('shows one-time mode by default', () => {
      cy.intercept('GET', '**/medications/rx_guide', { statusCode: 200, body: [] });

      visitHome();
    });
  });
});
