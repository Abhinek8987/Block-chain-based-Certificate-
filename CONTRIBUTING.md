# Contributing to Blockchain Certificate Verification System

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/your-username/blockchain-certificate-verification/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/your-username/blockchain-certificate-verification/issues/new).

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB
- MetaMask browser extension
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/blockchain-certificate-verification.git
   cd blockchain-certificate-verification
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy example files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   cp smart-contracts/.env.example smart-contracts/.env
   
   # Edit the .env files with your values
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or start your local MongoDB instance
   ```

5. **Deploy smart contracts locally**
   ```bash
   cd smart-contracts
   npx hardhat node # In one terminal
   npx hardhat run scripts/deploy.js --network localhost # In another terminal
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

## Code Style

### JavaScript/TypeScript

- Use ES6+ features
- Use async/await instead of callbacks
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Follow the existing code style

### React Components

- Use functional components with hooks
- Use TypeScript for type safety
- Keep components small and focused
- Use proper prop types
- Follow the existing component structure

### Solidity

- Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments
- Include proper error handling
- Use OpenZeppelin contracts when possible
- Write comprehensive tests

## Testing

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Smart contract tests
cd smart-contracts && npx hardhat test

# All tests
npm test
```

### Writing Tests

- Write unit tests for all new functions
- Write integration tests for API endpoints
- Write contract tests for all smart contract functions
- Aim for high test coverage
- Use descriptive test names

### Test Structure

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  describe('Function Name', () => {
    it('should do something specific', () => {
      // Test implementation
    });

    it('should handle error cases', () => {
      // Error test implementation
    });
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments to all functions
- Include parameter types and return types
- Explain complex logic with inline comments
- Update README files when adding features

### API Documentation

- Update API documentation for new endpoints
- Include request/response examples
- Document error codes and responses
- Keep OpenAPI/Swagger specs updated

## Commit Messages

Use clear and meaningful commit messages:

```
feat: add certificate batch verification
fix: resolve IPFS upload timeout issue
docs: update API documentation
test: add unit tests for certificate validation
refactor: improve error handling in auth middleware
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `fix/*`: Bug fixes
- `hotfix/*`: Critical fixes for production

### Branch Naming

```
feature/certificate-batch-upload
fix/ipfs-timeout-error
hotfix/security-vulnerability
```

## Code Review Process

1. **Create a Pull Request**
   - Use a descriptive title
   - Include a detailed description
   - Reference related issues
   - Add screenshots for UI changes

2. **Review Checklist**
   - Code follows style guidelines
   - Tests are included and passing
   - Documentation is updated
   - No security vulnerabilities
   - Performance considerations addressed

3. **Approval Process**
   - At least one maintainer approval required
   - All CI checks must pass
   - Address all review comments

## Security

### Reporting Security Issues

Please do not report security vulnerabilities through public GitHub issues. Instead, send an email to security@certverify.com.

### Security Guidelines

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Use HTTPS in production
- Follow OWASP security guidelines
- Regular dependency updates

## Performance

### Guidelines

- Optimize database queries
- Use pagination for large datasets
- Implement caching where appropriate
- Minimize bundle sizes
- Optimize images and assets
- Monitor performance metrics

## Accessibility

### Requirements

- Follow WCAG 2.1 AA guidelines
- Use semantic HTML
- Provide alt text for images
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast ratios

## Internationalization

### Guidelines

- Use i18n libraries for text
- Support RTL languages
- Consider cultural differences
- Test with different locales
- Provide translation keys

## Release Process

1. **Version Bumping**
   ```bash
   npm version patch|minor|major
   ```

2. **Changelog Update**
   - Update CHANGELOG.md
   - Include breaking changes
   - Credit contributors

3. **Testing**
   - Run full test suite
   - Manual testing
   - Security audit

4. **Deployment**
   - Deploy to staging
   - Smoke tests
   - Deploy to production

## Community

### Communication

- GitHub Discussions for general questions
- GitHub Issues for bugs and features
- Discord for real-time chat
- Email for security issues

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Annual contributor highlights

## Getting Help

- Check existing issues and documentation
- Ask questions in GitHub Discussions
- Join our Discord community
- Contact maintainers directly

Thank you for contributing to the Blockchain Certificate Verification System!