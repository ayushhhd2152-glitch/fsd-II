function RoleButton({
  userRole,
  allowedRoles,
  children,
  onClick,
}) {
  if (
    !allowedRoles.includes(userRole)
  ) {
    return null;
  }

  return (
    <button
      className="action-button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default RoleButton;