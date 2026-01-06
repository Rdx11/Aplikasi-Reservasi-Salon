<?php

namespace App\Extensions;

use Illuminate\Session\DatabaseSessionHandler;

class CustomDatabaseSessionHandler extends DatabaseSessionHandler
{
    /**
     * Get the user ID from the session payload.
     *
     * @return mixed
     */
    protected function userId()
    {
        // Get the authenticated user's id_user instead of id
        return $this->container->make('auth')->id();
    }
}
