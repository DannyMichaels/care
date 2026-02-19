describe('Authentication', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/auth/verify', { statusCode: 401, body: {} }).as('verifyFail');
  });

  describe('Login', () => {
    it('displays login form', () => {
      cy.visit('/login');
      cy.contains('Care');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').contains('Login');
    });

    it('logs in with valid credentials', () => {
      cy.login();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('shows error with invalid credentials', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: { message: 'Invalid email or password' },
      }).as('loginFail');

      cy.visit('/login');
      cy.get('input[name="email"]').type('wrong@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.wait('@loginFail');
      cy.contains('Invalid email or password');
    });

    it('has a forgot password link', () => {
      cy.visit('/login');
      cy.contains('Forgot your password?').click();
      cy.url().should('include', '/forgot-password');
    });

    it('has a register link', () => {
      cy.visit('/login');
      cy.contains('Register').click();
      cy.url().should('include', '/register');
    });
  });

  describe('Register', () => {
    it('displays registration form', () => {
      cy.visit('/register');
      cy.contains('Care');
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
    });

    it('registers and redirects to verify email', () => {
      cy.intercept('POST', '**/users/', {
        statusCode: 201,
        body: {
          user: { id: 1, name: 'New User', email: 'new@example.com', gender: 'Male' },
          token: 'fake-token',
        },
      }).as('registerRequest');

      cy.intercept('POST', '**/email_verifications', {
        statusCode: 201,
        body: { message: 'Verification code sent' },
      }).as('sendCode');

      cy.visit('/register');
      cy.get('input[name="name"]').type('New User');
      cy.get('input[name="email"]').type('new@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="passwordConfirm"]').type('password123');
      cy.get('#date').type('1995-01-01');
      cy.get('select[name="gender"]').select('Male');
      cy.get('input[type="checkbox"]').check();
      cy.get('button[type="submit"]').click();

      cy.wait('@registerRequest');
      cy.url().should('include', '/verify-email');
    });
  });

  describe('Forgot Password', () => {
    it('sends verification code and redirects to reset', () => {
      cy.intercept('POST', '**/email_verifications', {
        statusCode: 201,
        body: { message: 'Verification code sent' },
      }).as('sendCode');

      cy.visit('/forgot-password');
      cy.get('input#email').type('test@example.com');
      cy.get('button[type="submit"]').click();

      cy.wait('@sendCode');
      cy.url().should('include', '/reset-password');
    });
  });

  describe('Email Verification', () => {
    it('displays code input and verify button', () => {
      cy.visit('/verify-email?email=test@example.com');
      cy.contains('test@example.com');
      cy.contains('Verify Email');
      cy.contains('Resend Code');
    });

    it('verifies email with valid code', () => {
      cy.intercept('POST', '**/email_verifications/verify', {
        statusCode: 200,
        body: { message: 'Email verified successfully' },
      }).as('verifyCode');

      cy.visit('/verify-email?email=test@example.com');

      // Type 6 digits
      cy.get('input').eq(0).type('1');
      cy.get('input').eq(1).type('2');
      cy.get('input').eq(2).type('3');
      cy.get('input').eq(3).type('4');
      cy.get('input').eq(4).type('5');
      cy.get('input').eq(5).type('6');

      cy.contains('Verify Email').click();
      cy.wait('@verifyCode');
      cy.url().should('include', '/login');
    });
  });
});
