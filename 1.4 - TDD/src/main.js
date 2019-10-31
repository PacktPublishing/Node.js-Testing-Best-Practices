class User {
  constructor() {
    this.firstName = undefined;
    this.lastName = undefined;
    this.email = undefined;
  }
  setEmail(anEmail) {
    if (anEmail.match(/[\w]+\@[\w]+\.com|org|net/i)) {
      this.email = anEmail;
    }
  }
}

module.exports.User = User;
