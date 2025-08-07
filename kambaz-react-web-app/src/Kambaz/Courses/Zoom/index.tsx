import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  IconButton,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  TextField
} from '@mui/material';
import {
  VideoCall,
  VideocamOff,
  Mic,
  MicOff,
  ScreenShare,
  StopScreenShare,
  Chat,
  People,
  Settings,
  CallEnd,
  PresentToAll,
  FiberManualRecord,
  MoreVert
} from '@mui/icons-material';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isPresenting: boolean;
}

export default function ZoomVideoMeeting() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const participants: Participant[] = [
    {
      id: '1',
      name: 'Professor Smith',
      avatar: 'PS',
      isMuted: false,
      isVideoOn: true,
      isPresenting: true
    },
    {
      id: '2',
      name: 'Alice Johnson',
      avatar: 'AJ',
      isMuted: true,
      isVideoOn: true,
      isPresenting: false
    },
    {
      id: '3',
      name: 'Bob Chen',
      avatar: 'BC',
      isMuted: false,
      isVideoOn: false,
      isPresenting: false
    },
    {
      id: '4',
      name: 'Carol Williams',
      avatar: 'CW',
      isMuted: true,
      isVideoOn: true,
      isPresenting: false
    },
    {
      id: '5',
      name: 'You',
      avatar: 'Y',
      isMuted: isMuted,
      isVideoOn: isVideoOn,
      isPresenting: false
    }
  ];

  const chatMessages = [
    { id: 1, sender: 'Professor Smith', message: 'Welcome everyone to today\'s lecture!', time: '2:30 PM' },
    { id: 2, sender: 'Alice Johnson', message: 'Thank you professor!', time: '2:31 PM' },
    { id: 3, sender: 'Bob Chen', message: 'Can you share the slides?', time: '2:32 PM' },
  ];

  const handleVideoToggle = () => setIsVideoOn(!isVideoOn);
  const handleMuteToggle = () => setIsMuted(!isMuted);
  const handleScreenShare = () => setIsScreenSharing(!isScreenSharing);
  const handleRecording = () => setIsRecording(!isRecording);

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.100', minHeight: '100vh' }}>
      {/* Meeting Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" gutterBottom>
                CS 5610 - Web Development
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Lecture: React Components & Material UI
              </Typography>
              <Chip
                label={isRecording ? "Recording" : "Live"}
                color={isRecording ? "error" : "success"}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                Meeting ID: 123-456-789
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Duration: 45:23
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Main Video Area */}
        <Grid size={{ xs: 12, md: showParticipants || showChat ? 8 : 12 }}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              {/* Video Grid */}
              <Box sx={{ bgcolor: 'black', minHeight: 400, position: 'relative' }}>
                <Grid container spacing={1} sx={{ p: 1, height: '100%' }}>
                  {participants.slice(0, 4).map((participant) => (
                    <Grid size={{ xs: 6 }} key={participant.id}>
                      <Paper
                        sx={{
                          height: 200,
                          bgcolor: participant.isVideoOn ? 'grey.800' : 'grey.900',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {participant.isVideoOn ? (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              bgcolor: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="h4" color="white">
                              📹
                            </Typography>
                          </Box>
                        ) : (
                          <Avatar sx={{ width: 80, height: 80, fontSize: '2rem' }}>
                            {participant.avatar}
                          </Avatar>
                        )}

                        {/* Participant Info Overlay */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            right: 8,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1
                            }}
                          >
                            {participant.name}
                          </Typography>
                          <Box display="flex" gap={0.5}>
                            {participant.isMuted && (
                              <MicOff sx={{ color: 'error.main', fontSize: 16 }} />
                            )}
                            {participant.isPresenting && (
                              <PresentToAll sx={{ color: 'primary.main', fontSize: 16 }} />
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Control Bar */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <IconButton
                  onClick={handleMuteToggle}
                  color={isMuted ? 'error' : 'primary'}
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  {isMuted ? <MicOff /> : <Mic />}
                </IconButton>

                <IconButton
                  onClick={handleVideoToggle}
                  color={!isVideoOn ? 'error' : 'primary'}
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  {isVideoOn ? <VideoCall /> : <VideocamOff />}
                </IconButton>

                <IconButton
                  onClick={handleScreenShare}
                  color={isScreenSharing ? 'success' : 'primary'}
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
                </IconButton>

                <IconButton
                  onClick={handleRecording}
                  color={isRecording ? 'error' : 'primary'}
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  <FiberManualRecord />
                </IconButton>

                <IconButton
                  onClick={() => setShowParticipants(!showParticipants)}
                  color="primary"
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  <People />
                </IconButton>

                <IconButton
                  onClick={() => setShowChat(!showChat)}
                  color="primary"
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  <Chat />
                </IconButton>

                <IconButton
                  color="primary"
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  <Settings />
                </IconButton>

                <Button
                  variant="contained"
                  color="error"
                  startIcon={<CallEnd />}
                  sx={{ ml: 2 }}
                >
                  Leave Meeting
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar - Participants or Chat */}
        {(showParticipants || showChat) && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 0 }}>
                {showParticipants && (
                  <Box>
                    <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                      <Typography variant="h6">
                        Participants ({participants.length})
                      </Typography>
                    </Box>
                    <List dense>
                      {participants.map((participant, index) => (
                        <React.Fragment key={participant.id}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>{participant.avatar}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={participant.name}
                              secondary={
                                <Box display="flex" gap={1} mt={0.5}>
                                  {participant.isMuted && (
                                    <Chip label="Muted" size="small" color="error" />
                                  )}
                                  {participant.isPresenting && (
                                    <Chip label="Presenting" size="small" color="primary" />
                                  )}
                                  {!participant.isVideoOn && (
                                    <Chip label="No Video" size="small" variant="outlined" />
                                  )}
                                </Box>
                              }
                            />
                            <IconButton size="small">
                              <MoreVert />
                            </IconButton>
                          </ListItem>
                          {index < participants.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                )}

                {showChat && (
                  <Box sx={{ height: 500, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                      <Typography variant="h6">Chat</Typography>
                    </Box>

                    <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
                      {chatMessages.map((msg) => (
                        <Box key={msg.id} sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {msg.sender} • {msg.time}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {msg.message}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Type a message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setChatMessage('');
                          }
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Meeting Info Cards */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Agenda
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Introduction to Material UI<br/>
                • Component Props and State<br/>
                • Styling with sx prop<br/>
                • Q&A Session
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meeting Resources
              </Typography>
              <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                Download Slides
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                View Recording
              </Button>
              <Button variant="outlined" fullWidth>
                Submit Assignment
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Next Meeting
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Friday, August 9th at 2:00 PM<br/>
                Topic: Advanced React Patterns<br/>
                Room: Same meeting room
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
