"use client";
import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, Chip, Select, MenuItem, Box, Badge } from '@mui/material';

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState('');
  const [viewed, setViewed] = useState(new Set());

  useEffect(() => {
    // Load viewed state from localStorage
    const saved = localStorage.getItem('viewedNotifications');
    if (saved) setViewed(new Set(JSON.parse(saved)));
    fetchNotifications();
  }, [limit, type]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const typeParam = type ? `&notification_type=${type}` : '';
      const res = await fetch(`/api/notifications?limit=100${typeParam}`); // Fetch a large batch to sort priority
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      const notifs = data.notifications || [];
      
      const getWeight = (type) => {
          if (type === "Placement") return 3;
          if (type === "Result") return 2;
          if (type === "Event") return 1;
          return 0;
      };

      notifs.sort((a, b) => {
          const weightA = getWeight(a.Type);
          const weightB = getWeight(b.Type);
          if (weightA !== weightB) return weightB - weightA;
          return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
      });

      setNotifications(notifs.slice(0, limit));
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
        <Typography variant="h4">Priority Inbox</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Select size="small" displayEmpty value={type} onChange={(e) => setType(e.target.value)}>
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Event">Events</MenuItem>
            <MenuItem value="Result">Results</MenuItem>
            <MenuItem value="Placement">Placements</MenuItem>
          </Select>
          <Select size="small" value={limit} onChange={(e) => setLimit(e.target.value)}>
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
      ) : (
        notifications.map((notif) => (
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
        ))
      )}
    </Container>
  );
}