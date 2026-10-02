import React from 'react';
import { styled, keyframes } from '../stitches.config.js';
import { Trophy, Users, Calendar, Code, ChevronRight, Award, Timer } from 'lucide-react';

const fadeIn = keyframes({
    '0%': { opacity: 0, transform: 'translateY(10px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
});

const Container = styled('div', {
    flex: 1,
    padding: '32px 48px',
    backgroundColor: 'var(--colors-bg)',
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0, height: '400px',
        background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.05) 0%, rgba(15, 23, 42, 0) 100%)',
        pointerEvents: 'none'
    },
    '@media (max-width: 768px)': {
        padding: '16px',
    }
});

const Header = styled('div', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    animation: `${fadeIn} 0.5s ease-out`
});

const Title = styled('h1', {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: 'var(--colors-textMain)',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
});

const Subtitle = styled('p', {
    color: 'var(--colors-textMuted)',
    fontSize: '1.1rem'
});

const Grid = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
    animation: `${fadeIn} 0.6s ease-out 0.1s both`,
    '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
    }
});

const Card = styled('div', {
    backgroundColor: 'var(--colors-surface)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid var(--colors-border)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0, height: '4px',
        background: 'linear-gradient(90deg, var(--colors-accent), #3B82F6)',
        opacity: 0,
        transition: 'opacity 0.3s'
    },
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        '&::before': {
            opacity: 1
        }
    }
});

const Badge = styled('span', {
    padding: '4px 10px',
    borderRadius: 'full',
    fontSize: '0.75rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    variants: {
        status: {
            active: { background: 'rgba(16, 185, 129, 0.1)', color: '#34D399' },
            upcoming: { background: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA' },
            ended: { background: 'rgba(148, 163, 184, 0.1)', color: '#94A3B8' }
        }
    }
});

const CardHeader = styled('div', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
});

const EventTitle = styled('h3', {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--colors-textMain)',
    lineHeight: 1.4,
    marginBottom: '8px'
});

const EventDesc = styled('p', {
    color: 'var(--colors-textMuted)',
    fontSize: '0.9rem',
    lineHeight: 1.5,
    flex: 1
});

const MetaRow = styled('div', {
    display: 'flex',
    gap: '16px',
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.05)'
});

const MetaItem = styled('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--colors-textMuted)',
    fontSize: '0.85rem',
    fontWeight: '500'
});

const Button = styled('button', {
    background: 'linear-gradient(135deg, var(--colors-accent) 0%, #3B82F6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
    }
});

const MOCK_HACKATHONS = [
    { id: 1, title: 'Global AI Hackathon 2026', desc: 'Build the next generation of AI-powered applications. Top prize $50,000.', status: 'active', participants: 1240, daysLeft: 2, prize: '$50k' },
    { id: 2, title: 'Web3 Innovators Sprint', desc: 'Create decentralized apps that solve real-world problems using smart contracts.', status: 'upcoming', participants: 850, daysLeft: 14, prize: '$25k' },
    { id: 3, title: 'GreenTech Challenge', desc: 'Develop software solutions for climate change and sustainability.', status: 'upcoming', participants: 420, daysLeft: 30, prize: '$10k' },
    { id: 4, title: 'Fintech Disruption', desc: 'Reinvent payments, banking, and financial services.', status: 'ended', participants: 2100, daysLeft: 0, prize: '$100k' },
];

const MOCK_COMPETITIONS = [
    { id: 1, title: 'Weekly Algorithms Arena', desc: 'Test your competitive programming skills against top developers globally.', status: 'active', participants: 5400, daysLeft: 1, prize: 'Rank' },
    { id: 2, title: 'Frontend UI Challenge', desc: 'Design and implement a pixel-perfect dashboard with complex animations.', status: 'upcoming', participants: 1200, daysLeft: 5, prize: 'Gear' },
    { id: 3, title: 'System Design Interview Prep', desc: 'Mock architecture design contest simulating FAANG interviews.', status: 'active', participants: 320, daysLeft: 3, prize: 'Premium' },
];

export default function EventsView({ type }) {
    const isHackathon = type === 'hackathons';
    const data = isHackathon ? MOCK_HACKATHONS : MOCK_COMPETITIONS;
    const Icon = isHackathon ? Code : Trophy;
    const titleText = isHackathon ? 'Hackathons' : 'Competitions';
    
    return (
        <Container>
            <Header>
                <div>
                    <Title>
                        <div style={{ padding: '12px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '16px', display: 'flex' }}>
                            <Icon size={28} color="var(--colors-accent)" />
                        </div>
                        {titleText}
                    </Title>
                    <Subtitle>
                        {isHackathon 
                            ? 'Collaborate, build, and win prizes in global coding events.' 
                            : 'Sharpen your skills and climb the leaderboards.'}
                    </Subtitle>
                </div>
                <Button>
                    Host {isHackathon ? 'Hackathon' : 'Competition'}
                    <ChevronRight size={18} />
                </Button>
            </Header>

            <Grid>
                {data.map(item => (
                    <Card key={item.id}>
                        <CardHeader>
                            <Badge status={item.status}>
                                {item.status === 'active' ? 'Live Now' : item.status === 'upcoming' ? 'Upcoming' : 'Ended'}
                            </Badge>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--colors-textMain)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Award size={14} color="#F59E0B" /> {item.prize}
                            </div>
                        </CardHeader>
                        
                        <div>
                            <EventTitle>{item.title}</EventTitle>
                            <EventDesc>{item.desc}</EventDesc>
                        </div>
                        
                        <MetaRow>
                            <MetaItem>
                                <Users size={16} /> {item.participants.toLocaleString()} joined
                            </MetaItem>
                            <MetaItem>
                                {item.status === 'ended' ? <Calendar size={16} /> : <Timer size={16} />}
                                {item.status === 'ended' ? 'Finished' : `${item.daysLeft} days left`}
                            </MetaItem>
                        </MetaRow>
                    </Card>
                ))}
            </Grid>
        </Container>
    );
}
