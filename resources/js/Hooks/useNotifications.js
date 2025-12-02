import { useState, useEffect, useCallback, useRef } from 'react';

// Generate notification sound using Web Audio API
function createNotificationSound() {
    let audioContext = null;
    
    return () => {
        try {
            // Create new context each time or resume existing
            if (!audioContext || audioContext.state === 'closed') {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            // Create oscillators for a pleasant notification tone
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Pleasant bell-like frequencies
            oscillator1.frequency.setValueAtTime(830, audioContext.currentTime);
            oscillator1.frequency.setValueAtTime(1046, audioContext.currentTime + 0.15);
            
            oscillator2.frequency.setValueAtTime(622, audioContext.currentTime);
            oscillator2.frequency.setValueAtTime(784, audioContext.currentTime + 0.15);
            
            oscillator1.type = 'sine';
            oscillator2.type = 'sine';
            
            // Volume envelope - louder and longer
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.02);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.15);
            gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.17);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.6);
            
            oscillator1.start(audioContext.currentTime);
            oscillator2.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.6);
            oscillator2.stop(audioContext.currentTime + 0.6);
            
            return true;
        } catch (e) {
            console.error('Sound play error:', e);
            return false;
        }
    };
}

export function useNotifications(interval = 10000) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const lastCheckRef = useRef(null);
    const playSoundRef = useRef(null);
    const hasInteractedRef = useRef(false);
    const seenIdsRef = useRef(new Set());
    const isFirstLoadRef = useRef(true);

    // Initialize audio on user interaction
    useEffect(() => {
        const handleInteraction = () => {
            hasInteractedRef.current = true;
            if (!playSoundRef.current) {
                playSoundRef.current = createNotificationSound();
            }
        };

        // Listen for any user interaction
        const events = ['click', 'keydown', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, handleInteraction, { once: false });
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleInteraction);
            });
        };
    }, []);

    const playNotificationSound = useCallback(() => {
        console.log('Attempting to play sound...', {
            hasSound: !!playSoundRef.current,
            hasInteracted: hasInteractedRef.current,
            soundEnabled
        });
        
        if (playSoundRef.current && hasInteractedRef.current && soundEnabled) {
            const result = playSoundRef.current();
            console.log('Sound played:', result);
            return result;
        }
        return false;
    }, [soundEnabled]);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (lastCheckRef.current) {
                params.append('last_check', lastCheckRef.current);
            }

            const response = await fetch(`/admin/notifications/new-bookings?${params}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Update server time for next check
            lastCheckRef.current = data.server_time;
            setUnreadCount(data.unread_count || 0);

            if (data.bookings && data.bookings.length > 0) {
                // Find truly new bookings we haven't seen
                const newBookings = data.bookings.filter(b => !seenIdsRef.current.has(b.id));
                
                // Add all booking IDs to seen set
                data.bookings.forEach(b => seenIdsRef.current.add(b.id));
                
                // Play sound only for new bookings (not on first load)
                if (!isFirstLoadRef.current && newBookings.length > 0) {
                    console.log('🔔 New booking detected!', newBookings.length);
                    playNotificationSound();
                    
                    // Show browser notification
                    if ('Notification' in window && Notification.permission === 'granted') {
                        newBookings.forEach(booking => {
                            new Notification('🔔 Booking Baru!', {
                                body: `${booking.customer_name} - ${booking.service_name}`,
                                icon: '/favicon.ico',
                                tag: `booking-${booking.id}`,
                                requireInteraction: true,
                            });
                        });
                    }
                }
                
                // Update notifications list
                setNotifications(prev => {
                    const prevIds = new Set(prev.map(n => n.id));
                    const toAdd = data.bookings.filter(b => !prevIds.has(b.id));
                    return [...toAdd, ...prev].slice(0, 20);
                });
            }
            
            isFirstLoadRef.current = false;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [playNotificationSound]);

    // Request notification permission
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Polling
    useEffect(() => {
        fetchNotifications();
        const timer = setInterval(fetchNotifications, interval);
        return () => clearInterval(timer);
    }, [fetchNotifications, interval]);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    // Test sound function for debugging
    const testSound = useCallback(() => {
        if (!playSoundRef.current) {
            playSoundRef.current = createNotificationSound();
        }
        hasInteractedRef.current = true;
        return playSoundRef.current();
    }, []);

    return {
        notifications,
        unreadCount,
        isLoading,
        soundEnabled,
        setSoundEnabled,
        refetch: fetchNotifications,
        clearNotifications,
        testSound,
    };
}
