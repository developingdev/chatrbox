using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace chatRbox.Hubs
{
    public class ChatrHub : Hub
    {
        public void Send(string message, string roomId)
        {
            //sender could be identified here but instead of being sent but lets have the client do the work
            var id = Context.ConnectionId;
            // Call the addNewMessageToPage method to update clients.
            Clients.Group(roomId).addNewMessageToPage(id, message);
        }

        public void GetUserId()
        {
            var id = Context.ConnectionId;
            Clients.Caller.setUserId(id);
        }

        public Task JoinRoom(string roomName)
        {
            return Groups.Add(Context.ConnectionId, roomName);
        }

        public Task LeaveRoom(string roomName)
        {
            return Groups.Remove(Context.ConnectionId, roomName);
        }
    }
}