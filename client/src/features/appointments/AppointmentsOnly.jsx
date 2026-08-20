import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments, cancelAppointment } from "./appointmentsSlice";

export default function AppointmentsOnly() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.appointments);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const onCancel = (id) => dispatch(cancelAppointment(id));

  return (
    <div className="page appointments-only">
      <h2>My appointments</h2>
      <p className="muted">Your upcoming appointment requests.</p>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Reason</th>
            <th>When</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a._id}>
              <td>{a.doctor}</td>
              <td>{a.reason}</td>
              <td>{new Date(a.scheduledFor).toLocaleString()}</td>
              <td>
                <span className={`badge ${a.status}`}>{a.status}</span>
              </td>
              <td>
                <button onClick={() => onCancel(a._id)}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
