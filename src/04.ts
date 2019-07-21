interface Admin {
  id: string;
  role: string;
}
interface User {
  email: string;
}

/**
 * If user is admin, redirect to admin page, else route user to user page
 */

function redirectWithAssumption(usr: Admin | User) {
  /**
   * We can assume the user is an admin
   */
  if ((<Admin>usr).role !== undefined) {
    // routeToAdminPage(usr)
  } else {
    // routeToUserPage(usr)
  }
}

function redirectWithGuard(usr: Admin | User) {
  /**
   * We can use a guard, guaranteeing an admin if the guard returns true
   */
  if (isAdmin(usr)) {
    // routeToAdminPage(usr)
  } else {
    // routeToUserPage(usr)
  }
}

function isAdmin(usr: Admin | User): usr is Admin {
  return (<Admin>usr).role !== undefined;
}

function redirectWithIn(usr: Admin | User) {
  /**
   * We can use the `in` operator to infer the type should we evaluate a
   * property that is on one interface, but not the other
   */
  if ('role' in usr) {
    // routeToAdminPage(usr)
  } else {
    // routeToUserPage(usr)
  }
}
