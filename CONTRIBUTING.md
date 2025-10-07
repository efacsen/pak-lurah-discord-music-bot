# Contributing to Pak Lurah Discord Music Bot

First off, thank you for considering contributing to this project! 🎉

## 📌 Important Context

This is a **hobby project built in free time**. I appreciate all contributions, but please understand:

- Review times may vary based on my availability
- Not all features/suggestions can be implemented
- The project direction is guided by personal needs and community feedback
- Patience and understanding are greatly appreciated

## 🤝 Ways to Contribute

### 1. Report Bugs 🐛

If you find a bug:

1. **Check existing issues** to avoid duplicates
2. **Use the issue tracker** on GitHub
3. **Include details**:
   - Operating system (Windows/macOS/Linux)
   - Node.js version (`node --version`)
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Console error messages (if any)
   - Screenshot/video (if helpful)

**Example:**
```markdown
**Bug**: Bot disconnects after playing one song

**Environment**:
- OS: macOS 14.5
- Node.js: v20.10.0
- Bot version: 2.0.0

**Steps to Reproduce**:
1. Use `/play never gonna give you up`
2. Wait for song to finish
3. Bot disconnects from voice channel

**Expected**: Bot should stay connected
**Actual**: Bot disconnects automatically

**Error logs**:
```
[Error] Queue finished but bot disconnected
```
```

### 2. Suggest Features 💡

Have an idea? Great!

1. **Check existing issues/discussions** first
2. **Open a GitHub issue** with the "enhancement" label
3. **Describe your idea** clearly:
   - What problem does it solve?
   - How would it work?
   - Why is it useful?
   - Are there any alternatives?

**Note**: Not all features can be implemented due to time constraints or project scope.

### 3. Submit Code 💻

Want to contribute code? Awesome!

#### Before You Start

1. **Open an issue first** to discuss your idea
2. **Wait for feedback** to ensure it aligns with project goals
3. **Fork the repository**
4. **Create a new branch**: `git checkout -b feature/your-feature-name`

#### Code Guidelines

- **Follow existing code style** (check existing files for patterns)
- **Write clear, descriptive commit messages**
- **Comment complex logic**
- **Test your changes** thoroughly
- **Update documentation** if needed (README, TROUBLESHOOTING, etc.)

#### Pull Request Process

1. **Ensure your code works**:
   ```bash
   npm run check  # Verify system requirements
   npm start      # Test the bot
   ```

2. **Update relevant documentation**:
   - README.md (if adding features)
   - TROUBLESHOOTING.md (if fixing bugs)
   - Comments in code

3. **Create a pull request** with:
   - Clear title describing the change
   - Detailed description of what changed and why
   - Reference to related issue (e.g., "Fixes #123")
   - Screenshots/videos (if UI-related)

4. **Respond to review feedback** politely and promptly

**Example PR description:**
```markdown
## Description
Adds support for Spotify playlist URLs

## Changes
- Created new SpotifyExtractor class
- Added spotify-web-api-node dependency
- Updated README with Spotify instructions

## Testing
- Tested with 5 different Spotify playlists
- Verified tracks play correctly
- Checked error handling for invalid URLs

Fixes #42
```

### 4. Improve Documentation 📖

Documentation improvements are always welcome!

- Fix typos or unclear instructions
- Add examples or clarifications
- Update outdated information
- Translate documentation (if applicable)

### 5. Help Others 🙋

- Answer questions in GitHub Discussions/Issues
- Help troubleshoot problems
- Share your setup experiences
- Write blog posts or tutorials

## 🚫 What NOT to Do

- Don't submit PRs without discussing first (for significant changes)
- Don't be rude or demanding (remember, this is a hobby project)
- Don't expect immediate responses (I work on this when I have time)
- Don't submit duplicate issues (search first!)
- Don't include sensitive data in issues (bot tokens, passwords, etc.)

## 🔒 Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. **Email me directly** (check package.json for contact)
3. **Include details** about the vulnerability
4. **Wait for a response** before disclosing publicly

## 📋 Code of Conduct

### Our Standards

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy toward others

### Unacceptable Behavior

- Harassment, insults, or personal attacks
- Trolling or inflammatory comments
- Publishing others' private information
- Spam or off-topic content

### Enforcement

Unacceptable behavior may result in:
1. Warning
2. Temporary ban
3. Permanent ban

## 💬 Communication

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, ideas, help
- **Pull Requests**: Code contributions

## 🎯 Priority Areas

Currently focusing on:

1. **Bug fixes** - Especially critical issues affecting core functionality
2. **YouTube playback stability** - Handling API changes
3. **Documentation improvements** - Making setup easier
4. **Cross-platform compatibility** - Ensuring it works on all OSes

## 🙏 Thank You!

Every contribution, no matter how small, is appreciated. Whether you're:
- Reporting a bug
- Fixing a typo
- Adding a feature
- Helping another user

**You're making this project better!**

---

**Questions?** Open a GitHub Discussion or issue, and I'll respond when I have time.

**Remember:** This is a hobby project. Let's keep it fun and friendly! 😊
