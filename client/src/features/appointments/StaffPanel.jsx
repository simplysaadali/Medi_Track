import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../api/axios";
import { updateStatus } from "./appointmentsSlice";

// TASK 7.5 - Staff-only screen. The UI mirrors the rule; the server enforces it.
export default function StaffPanel() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const load = async () => {
    try {
      const { data } = await api.get("/staff/appointments");
      setRows(data.appointments);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          requestError.response?.data?.msg ??
          "Unable to load clinic appointments"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    await dispatch(updateStatus({ id, status }));
    await load();
  };

  return (
    <div className="page">
      <h2>Clinic schedule (staff only)</h2>
      {error && <p className="error">{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>When</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a._id}>
              <td>{a.owner?.name}</td>
              <td>{a.doctor}</td>
              <td>{new Date(a.scheduledFor).toLocaleString()}</td>
              <td>
                <span className={`badge ${a.status}`}>{a.status}</span>
              </td>
              <td>
                <div className="staff-actions">
                  <button
                    className="confirm-button"
                    onClick={() => setStatus(a._id, "confirmed")}
                  >
                  Confirm
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setStatus(a._id, "cancelled")}
                  >
                  Cancel
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
