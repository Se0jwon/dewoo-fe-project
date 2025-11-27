import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Loader2, MapPin, Users, X, Edit2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  hotel_id: number;
  hotel_name: string;
  hotel_image: string | null;
  hotel_city: string | null;
  hotel_country: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
}

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editCheckIn, setEditCheckIn] = useState<Date>();
  const [editCheckOut, setEditCheckOut] = useState<Date>();
  const [editGuests, setEditGuests] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchBookings();
    }
  }, [user, authLoading, navigate]);

  const fetchBookings = async () => {
    if (!user) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setIsLoading(false);

    if (error) {
      toast.error("예약 내역을 불러오는데 실패했습니다");
      return;
    }

    setBookings(data || []);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", selectedBooking.id);

    if (error) {
      toast.error("예약 취소에 실패했습니다");
    } else {
      toast.success("예약이 취소되었습니다");
      fetchBookings();
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleEditBooking = async () => {
    if (!selectedBooking || !editCheckIn || !editCheckOut) return;

    const { error } = await supabase
      .from("bookings")
      .update({
        check_in: format(editCheckIn, "yyyy-MM-dd"),
        check_out: format(editCheckOut, "yyyy-MM-dd"),
        guests: editGuests,
      })
      .eq("id", selectedBooking.id);

    if (error) {
      toast.error("예약 수정에 실패했습니다");
    } else {
      toast.success("예약이 수정되었습니다");
      fetchBookings();
      setEditDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const openEditDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditCheckIn(parseISO(booking.check_in));
    setEditCheckOut(parseISO(booking.check_out));
    setEditGuests(booking.guests);
    setEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive"; label: string }> = {
      confirmed: { variant: "default", label: "예약 확정" },
      cancelled: { variant: "destructive", label: "취소됨" },
      completed: { variant: "secondary", label: "완료" },
    };

    const { variant, label } = variants[status] || { variant: "default" as const, label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (authLoading || isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold mb-2">나의 예약</h1>
            <p className="text-muted-foreground">예약 내역을 확인하고 관리하세요</p>
          </div>

          {bookings.length === 0 ? (
            <Card className="shadow-elegant">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">예약 내역이 없습니다</p>
                <Button onClick={() => navigate("/hotels")}>
                  호텔 둘러보기
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="shadow-elegant">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-display mb-2">
                          {booking.hotel_name}
                        </CardTitle>
                        {booking.hotel_city && booking.hotel_country && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.hotel_city}, {booking.hotel_country}</span>
                          </div>
                        )}
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {booking.hotel_image && (
                        <div className="md:col-span-1">
                          <img
                            src={booking.hotel_image}
                            alt={booking.hotel_name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className={booking.hotel_image ? "md:col-span-3" : "md:col-span-4"}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">체크인</p>
                            <p className="font-medium">
                              {format(parseISO(booking.check_in), "yyyy년 MM월 dd일")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">체크아웃</p>
                            <p className="font-medium">
                              {format(parseISO(booking.check_out), "yyyy년 MM월 dd일")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">투숙객</p>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <p className="font-medium">{booking.guests}명</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">총 결제 금액</p>
                            <p className="text-2xl font-bold text-primary">
                              ${booking.total_price.toLocaleString()}
                            </p>
                          </div>
                          
                          {booking.status === "confirmed" && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(booking)}
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                수정
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openCancelDialog(booking)}
                              >
                                <X className="w-4 h-4 mr-2" />
                                취소
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>예약 취소</DialogTitle>
            <DialogDescription>
              정말로 이 예약을 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              아니오
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              예, 취소합니다
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>예약 수정</DialogTitle>
            <DialogDescription>
              체크인/체크아웃 날짜와 투숙객 수를 변경할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>체크인 날짜</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editCheckIn && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editCheckIn ? format(editCheckIn, "PPP") : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editCheckIn}
                    onSelect={setEditCheckIn}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>체크아웃 날짜</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editCheckOut && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editCheckOut ? format(editCheckOut, "PPP") : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editCheckOut}
                    onSelect={setEditCheckOut}
                    disabled={(date) => !editCheckIn || date <= editCheckIn}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">투숙객 수</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                value={editGuests}
                onChange={(e) => setEditGuests(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditBooking}>
              수정 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyBookings;
