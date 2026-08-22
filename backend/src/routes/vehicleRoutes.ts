import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

router.post('/vehicles', async (req: Request, res: Response) => {
  const { make, model, category, price, quantity } = req.body;

  if (!make || !model || !category || price === undefined || quantity === undefined) {
    return res.status(400).json({
      message: 'make, model, category, price, and quantity are required',
    });
  }

  const parsedPrice = Number(price);
  const parsedQuantity = Number(quantity);

  if (typeof make !== 'string' || typeof model !== 'string' || typeof category !== 'string') {
    return res.status(400).json({ message: 'make, model, and category must be strings' });
  }

  if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ message: 'price must be a valid number and cannot be negative' });
  }

  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
    return res.status(400).json({ message: 'quantity must be a whole number and cannot be negative' });
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: make.trim(),
        model: model.trim(),
        category: category.trim(),
        price: parsedPrice,
        quantity: parsedQuantity,
      },
    });

    return res.status(201).json(vehicle);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create vehicle', error });
  }
});

router.get('/vehicles', async (_req: Request, res: Response) => {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  return res.status(200).json(vehicles);
});

router.get('/vehicles/search', async (req: Request, res: Response) => {
  const { make, category, minPrice, maxPrice } = req.query;
  const where: Record<string, unknown> = {};

  if (make) {
    where.make = {
      contains: String(make),
    };
  }

  if (category) {
    where.category = {
      contains: String(category),
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: Record<string, number> = {};

    if (minPrice !== undefined) {
      const parsedMinPrice = Number(minPrice);

      if (Number.isNaN(parsedMinPrice)) {
        return res.status(400).json({ message: 'minPrice must be a valid number' });
      }

      priceFilter.gte = parsedMinPrice;
    }

    if (maxPrice !== undefined) {
      const parsedMaxPrice = Number(maxPrice);

      if (Number.isNaN(parsedMaxPrice)) {
        return res.status(400).json({ message: 'maxPrice must be a valid number' });
      }

      priceFilter.lte = parsedMaxPrice;
    }

    where.price = priceFilter;
  }

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: {
      id: 'asc',
    },
  });

  return res.status(200).json(vehicles);
});

router.post('/vehicles/:id/purchase', async (req: Request, res: Response) => {
  const vehicleId = Number(req.params.id);

  if (!Number.isInteger(vehicleId)) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: vehicleId,
    },
  });

  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  if (vehicle.quantity <= 0) {
    return res.status(400).json({ message: 'Vehicle quantity is 0 or less' });
  }

  const updatedVehicle = await prisma.vehicle.update({
    where: {
      id: vehicleId,
    },
    data: {
      quantity: {
        decrement: 1,
      },
    },
  });

  return res.status(200).json(updatedVehicle);
});

router.delete('/vehicles/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  const vehicleId = Number(req.params.id);

  if (!Number.isInteger(vehicleId)) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: vehicleId,
    },
  });

  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  await prisma.vehicle.delete({
    where: {
      id: vehicleId,
    },
  });

  return res.status(200).json({ message: 'Vehicle deleted successfully' });
});

router.post('/vehicles/:id/restock', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  const vehicleId = Number(req.params.id);
  const { quantity } = req.body;

  if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive integer' });
  }

  if (!Number.isInteger(vehicleId)) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: vehicleId,
    },
  });

  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  const updatedVehicle = await prisma.vehicle.update({
    where: {
      id: vehicleId,
    },
    data: {
      quantity: {
        increment: Number(quantity),
      },
    },
  });

  return res.status(200).json(updatedVehicle);
});

export default router;
