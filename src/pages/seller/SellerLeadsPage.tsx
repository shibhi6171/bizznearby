import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  Check, 
  X,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useMyLeads, useUpdateLeadStatus } from '@/hooks/useLeads';
import { formatRelativeTime, getInitials, generateWhatsAppLink, generatePhoneLink } from '@/lib/utils';
import { LeadStatus } from '@/types/database';
import { toast } from 'sonner';

const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-accent text-accent-foreground' },
  contacted: { label: 'Contacted', color: 'bg-blue-500 text-white' },
  converted: { label: 'Converted', color: 'bg-success text-white' },
  closed: { label: 'Closed', color: 'bg-muted text-muted-foreground' },
};

export default function SellerLeadsPage() {
  const { isAuthenticated, isSeller, isLoading: authLoading } = useAuth();
  const { data: leads, isLoading } = useMyLeads();
  const updateLeadStatus = useUpdateLeadStatus();

  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');

  if (authLoading) {
    return (
      <div className="container-wide py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isSeller) {
    return <Navigate to="/auth" replace />;
  }

  const filteredLeads = leads?.filter(lead => 
    statusFilter === 'all' || lead.status === statusFilter
  ) || [];

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    try {
      await updateLeadStatus.mutateAsync({ id: leadId, status });
      toast.success('Lead status updated');
    } catch (error) {
      toast.error('Failed to update lead status');
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container-wide py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Leads Inbox</h1>
            <p className="text-muted-foreground mt-1">
              Manage customer inquiries and leads
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeadStatus | 'all')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leads</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Leads List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : filteredLeads.length > 0 ? (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <Card key={lead.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Customer Info */}
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={lead.consumer?.avatar_url || undefined} />
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {getInitials(lead.consumer?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{lead.consumer?.full_name || 'Customer'}</h3>
                          <Badge className={statusConfig[lead.status as LeadStatus]?.color || ''}>
                            {statusConfig[lead.status as LeadStatus]?.label || lead.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          {lead.consumer?.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {lead.consumer.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatRelativeTime(lead.created_at)}
                          </span>
                        </div>
                        <p className="text-sm bg-secondary/50 p-3 rounded-lg">
                          {lead.message || 'Interested in your listing'}
                        </p>
                        {lead.listing && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Re: {lead.listing.title}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:w-48">
                      {/* Contact Buttons */}
                      {lead.consumer?.phone && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 gap-1" asChild>
                            <a href={generatePhoneLink(lead.consumer.phone)}>
                              <Phone className="w-4 h-4" />
                              Call
                            </a>
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 gap-1" asChild>
                            <a 
                              href={generateWhatsAppLink(lead.consumer.phone)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="w-4 h-4" />
                              WhatsApp
                            </a>
                          </Button>
                        </div>
                      )}

                      {/* Status Actions */}
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value as LeadStatus)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Mark as New</SelectItem>
                          <SelectItem value="contacted">Mark as Contacted</SelectItem>
                          <SelectItem value="converted">Mark as Converted</SelectItem>
                          <SelectItem value="closed">Mark as Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-sm mx-auto">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">No leads yet</h3>
              <p className="text-muted-foreground">
                When customers contact you about your listings, their inquiries will appear here.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
