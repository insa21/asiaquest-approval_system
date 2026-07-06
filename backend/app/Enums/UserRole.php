<?php

namespace App\Enums;

enum UserRole: string
{
    case User = 'user';
    case Verifier = 'verifier';
    case Approver = 'approver';
}