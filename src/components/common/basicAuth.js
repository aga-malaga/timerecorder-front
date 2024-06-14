export function basicAuth(user) {
    if (!user || !user.login || !user.authdata) {
      return null;
    }
    return `Basic ${user.authdata}`;
  }