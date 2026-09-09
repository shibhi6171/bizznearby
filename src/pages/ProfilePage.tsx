import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const { user, signOut } = useAuth();

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 24 }}>
      <h1>Your Profile</h1>
      <p>Email: {user?.email}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default ProfilePage;
