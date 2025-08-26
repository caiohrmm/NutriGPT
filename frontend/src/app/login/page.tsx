"use client";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BrandLogo } from '@/components/BrandLogo';
import { AuthFooter } from '@/components/AuthFooter';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      await login(data.email, data.password);
      toast.success('Login realizado com sucesso');
      router.push('/dashboard');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Falha ao autenticar');
      toast.error(e?.response?.data?.message || 'Falha ao autenticar');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gradient-to-b from-white to-green-50 relative">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader>
          <div className="flex flex-col items-center gap-3">
            <BrandLogo />
            <CardTitle>Entrar</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? 'Entrando…' : 'Entrar'}
              </Button>
              <p className="text-sm">
                Não tem conta? <a className="text-green-700 underline" href="/register">Registre-se</a>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="fixed bottom-4 left-0 right-0">
        <AuthFooter />
      </div>
    </div>
  );
}


