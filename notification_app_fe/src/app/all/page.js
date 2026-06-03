"use client";
import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, Chip, Select, MenuItem, Box, Pagination, Badge } from '@mui/material';

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const [viewed, setViewed] = useState(new Set());
  const limit = 10;

  useEffect(() => {
    const saved = localStorage.getItem('viewedNotifications');
    if (saved) setViewed(new Set(JSON.parse(saved)));
    fetchNotifications();
  }, [page, type]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const typeParam = type ? `&notification_type=${type}` : '';
      const res = await fetch(`/api/notifications?page=${page}&limit=${limit}${typeParam}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const markAsViewed = (id) => {
    const newViewed = new Set(viewed);
    newViewed.add(id);
    setViewed(newViewed);
    localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(newViewed)));
  };

  const getChipColor = (type) => {
    if (type === "Placement") return "success";
    if (type === "Result") return "warning";
    return "info";
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">All Notifications</Typography>
        <Select size="small" displayEmpty value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="Event">Events</MenuItem>
          <MenuItem value="Result">Results</MenuItem>
          <MenuItem value="Placement">Placements</MenuItem>
        </Select>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
      ) : (
        <>
          {notifications.map((notif) => (
            <Card 
              key={notif.ID} 
              sx={{ mb: 2, cursor: 'pointer', bgcolor: viewed.has(notif.ID) ? 'background.paper' : 'action.hover' }}
              onClick={() => markAsViewed(notif.ID)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box>
                    {!viewed.has(notif.ID) && <Badge color="secondary" variant="dot" sx={{ mr: 2 }} />}
                    <Chip label={notif.Type} color={getChipColor(notif.Type)} size="small" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notif.Timestamp).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: viewed.has(notif.ID) ? 'normal' : 'bold' }}>
                  {notif.Message}
                </Typography>
              </CardContent>
            </Card>
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination count={10} page={page} onChange={(e, value) => setPage(value)} color="primary" />
          </Box>
        </>
      )}
    </Container>
  );
}