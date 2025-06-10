const HeaderProfile = ({ profile }) => {
  if (!profile) return null;

  return (
    <div style={styles.container}>
      <div style={styles.item}>
        <i
          className="fa fa-user"
          style={{ ...styles.icon, color: "#007bff" }}
        ></i>
        <span>{profile.username}</span>
      </div>
      <div style={styles.item}>
        <i
          className="fa fa-hashtag"
          style={{ ...styles.icon, color: "#555" }}
        ></i>
        <span>{profile.id}</span>
      </div>
      <div style={styles.item}>
        <i
          className="fa fa-users"
          style={{ ...styles.icon, color: "#6f42c1" }}
        ></i>
        <span>{profile.group || "No Group"}</span>
      </div>
      <div style={styles.item}>
        <i
          className="fa fa-shield-alt"
          style={{
            ...styles.icon,
            color: profile.is_superadmin ? "green" : "red",
          }}
        ></i>
        <span>{profile.is_superadmin ? "Super Admin" : "User"}</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: "20px",
    backgroundColor: "#f0f0f0",
    padding: "8px 12px",
    borderRadius: "8px",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  icon: {
    fontSize: "16px",
  },
};

export default HeaderProfile;
