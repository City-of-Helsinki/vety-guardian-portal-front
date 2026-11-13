import { UserManager, type User } from 'oidc-client-ts';

// Lets only one token renewal run at a time per UserManager
// to prevent "Maximum allowed refresh token reuse exceeded"
const inFlight = new WeakMap<UserManager, Promise<User | null>>();
const signinSilent = UserManager.prototype.signinSilent;

UserManager.prototype.signinSilent = function (
  this: UserManager,
  ...args: Parameters<UserManager['signinSilent']>
) {
  const pending = inFlight.get(this);
  if (pending) return pending;

  const renewal = signinSilent
    .apply(this, args)
    .finally(() => inFlight.delete(this));
  inFlight.set(this, renewal);
  return renewal;
};
