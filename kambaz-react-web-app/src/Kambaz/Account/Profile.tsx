import * as client from "./client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { FormControl, Button } from "react-bootstrap";
import PersonalCalendar from "../Calendar/PersonalCalendar";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <div style={{ padding: '1rem' }}>{children}</div>}
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const fetchProfile = useCallback(() => {
    if (!currentUser) return navigate("/Kambaz/Account/Signin");
    setProfile(currentUser);
  }, [currentUser, navigate]);

  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/Kambaz/Account/Signin");
  };

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  return (
    <div className="wd-profile-screen">
      <h3>Profile</h3>

      <div style={{ width: '100%' }}>
        <div style={{ borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
          <nav className="nav nav-tabs">
            <button
              className={`nav-link ${tabValue === 0 ? 'active' : ''}`}
              onClick={() => setTabValue(0)}
              type="button"
            >
              Profile Information
            </button>
            <button
              className={`nav-link ${tabValue === 1 ? 'active' : ''}`}
              onClick={() => setTabValue(1)}
              type="button"
            >
              Personal Calendar
            </button>
          </nav>
        </div>

        <TabPanel value={tabValue} index={0}>
          {profile && (
            <div>
              <FormControl defaultValue={profile.username} id="wd-username" className="mb-2"
                onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
              <FormControl defaultValue={profile.password} id="wd-password" className="mb-2"
                onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
              <FormControl defaultValue={profile.firstName} id="wd-firstname" className="mb-2"
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
              <FormControl defaultValue={profile.lastName} id="wd-lastname" className="mb-2"
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
              <FormControl defaultValue={profile.dob} id="wd-dob" className="mb-2"
                onChange={(e) => setProfile({ ...profile, dob: e.target.value })} type="date" />
              <FormControl defaultValue={profile.email} id="wd-email" className="mb-2"
                onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              <select value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="form-control mb-2" id="wd-role">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="FACULTY">Faculty</option>
                <option value="STUDENT">Student</option>
              </select>
              <button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update </button>
              <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
                Sign out
              </Button>
            </div>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PersonalCalendar />
        </TabPanel>
      </div>
    </div>
  );
}